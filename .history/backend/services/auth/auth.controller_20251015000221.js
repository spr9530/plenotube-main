const User = require('../user/user.schema.js')
const bcryptjs = require('bcryptjs');
const { genrateOtp } = require('../utils/genrateOtp.js');
const OTP = require('../../common/otp.model.schema.js');
const redisClient = require('../../config/redis.client.js');
const { jwt } = require('jsonwebtoken');

const createToken = (credentials) => {
    const token = jwt.sign(
        credentials,
        process.env.JWT_SECRET,
        { expiresIn: "1d" } 
    );

    return token;
}

exports.createNewAccount = async (req, res) => {
    try {
        const { full_name, username, email, password } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!full_name || !username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // === 1️⃣ Email rate limit: max 5 attempts in 12 hours ===
        const emailKey = `signup_attempts:${email}`;
        const emailAttempts = await redisClient.get(emailKey);

        if (emailAttempts && parseInt(emailAttempts) >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many signup attempts with this email. Try again after 12 hours.",
            });
        }

        // Increment email attempts
        if (!emailAttempts) await redisClient.setEx(emailKey, 12 * 60 * 60, "1");
        else await redisClient.incr(emailKey);

        // === 2️⃣ IP-based rate limit: max 10 attempts in 12 hours ===
        const ipKey = `signup_ip:${ip}`;
        const ipAttempts = await redisClient.get(ipKey);

        if (ipAttempts && parseInt(ipAttempts) >= 10) {
            return res.status(429).json({
                success: false,
                message: "Too many signups from your network. Please try again after 12 hours.",
            });
        }

        // Increment IP attempts
        if (!ipAttempts) await redisClient.setEx(ipKey, 12 * 60 * 60, "1");
        else await redisClient.incr(ipKey);

        // === 3️⃣ Check if user already exists ===
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing && existing.isVerified) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // === 4️⃣ Hash password and generate OTP ===
        const salt = await bcryptjs.genSalt(13);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const otp = genrateOtp();
        console.log("Generated OTP:", otp);

        // Store user temporarily in Redis
        const tempData = JSON.stringify({ full_name, username, email, password: hashedPassword });
        await redisClient.setEx(`signup:${email}`, 300, tempData);

        // Store OTP in Redis and DB
        await redisClient.setEx(`otp:${email}`, 300, otp);
        await OTP.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

        // TODO: Send OTP email via Nodemailer here

        res.json({
            success: true,
            message: "OTP sent successfully. Please verify within 5 minutes.",
            user: { email }
        });

    } catch (error) {
        console.error("❌ Error in signup:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.verifySignUpOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required" });
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                session: false,
                message: 'Your session has expired. Please try again.'
            });
        }

        // 1️⃣ Try fetching OTP from Redis
        const cacheOtp = await redisClient.get(`otp:${email}`);
        if (cacheOtp) {
            if (otp !== cacheOtp) {
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }

            // OTP matched
            const cacheUserStr = await redisClient.get(`signup:${email}`);
            if (!cacheUserStr) {
                return res.status(400).json({ success: false, message: "Session expired. Please register again." });
            }

            const cacheUser = JSON.parse(cacheUserStr);

            // Save user in MongoDB
            const user = new User({ ...cacheUser, isVerified: true });
            await user.save();

            // Cleanup
            await redisClient.del(`otp:${email}`);
            await redisClient.del(`signup:${email}`);
            await OTP.deleteOne({ email });

            const token = await createToken({userid:user._id, useremail:user.email, username:user.username});

            return res.json({ success: true, message: "OTP verified successfully", token, user });
        }

        // 2️⃣ Fallback to MongoDB OTP backup
        const backupOtp = await OTP.findOne({ email });
        if (!backupOtp) {
            return res.status(400).json({ success: false, message: "OTP expired or not found" });
        }

        if (backupOtp.expiresAt < Date.now()) {
            await OTP.deleteOne({ email });
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        if (otp !== backupOtp.otp) {
            return res.status(400).json({ success: false, message: "OTP mismatched" });
        }

        // Retrieve cached user from Redis if exists
        const cacheUserStr = await redisClient.get(`signup:${email}`);
        if (!cacheUserStr) {
            return res.status(400).json({ success: false, message: "Session expired. Please register again." });
        }
        const cacheUser = JSON.parse(cacheUserStr);

        const user = new User({ ...cacheUser, isVerified: true });
        await user.save();

        // Cleanup
        await redisClient.del(`signup:${email}`);
        await OTP.deleteOne({ email });

        return res.json({ success: true, message: "OTP verified successfully (via DB fallback)" });

    } catch (error) {
        console.error("❌ Error verifying signup OTP:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.createAccountViaGoogle = async (req, res) => {
    try {
        const { full_name, username, email } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!full_name || !username || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // === 1️⃣ Email rate limit: max 5 attempts in 12 hours ===
        const emailKey = `signup_attempts:${email}`;
        const emailAttempts = await redisClient.get(emailKey);

        if (emailAttempts && parseInt(emailAttempts) >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many signup attempts with this email. Try again after 12 hours.",
            });
        }

        // Increment email attempts
        if (!emailAttempts) await redisClient.setEx(emailKey, 12 * 60 * 60, "1");
        else await redisClient.incr(emailKey);

        // === 2️⃣ IP-based rate limit: max 10 attempts in 12 hours ===
        const ipKey = `signup_ip:${ip}`;
        const ipAttempts = await redisClient.get(ipKey);

        if (ipAttempts && parseInt(ipAttempts) >= 10) {
            return res.status(429).json({
                success: false,
                message: "Too many signups from your network. Please try again after 12 hours.",
            });
        }

        // Increment IP attempts
        if (!ipAttempts) await redisClient.setEx(ipKey, 12 * 60 * 60, "1");
        else await redisClient.incr(ipKey);

        // === 3️⃣ Check if user already exists ===
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing && existing.isVerified) {
            const token = await createToken({userid:existing._id, useremail:existing.email, username:existing.username});
            return res.status(400).json({ success: true, message: "User already exists", user:existing,  token });
        }

        const newUser = new User({
            full_name:name,
            email,
            username,
            isVerified:true
        })
        await newUser.save();

        const token = await createToken({userid:user._id, useremail:user.email, username:user.username});

        res.json({
            success: true,
            message: "OTP sent successfully. Please verify within 5 minutes.",
            user: newUser,
            token
        });

    } catch (error) {
        console.error("❌ Error in signup:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.loginUserAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🧩 Basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // 🔍 Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // 🔐 Compare passwords
        const isMatched = await bcryptjs.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // 🧾 Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // 1 day token validity
        );

        // 🍪 Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // ✅ Send success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                username: user.username
            },
            token // optional if you want to send it in body too
        });

    } catch (error) {
        console.error('Error in loginUserAccount:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.changeUserPassword = async (req, res) => {
    try {
        const { username } = req.body;

        // ✅ 1. Validation
        if (!username) {
            return res.status(400).json({ success: false, message: 'Please provide your username' });
        }

        // ✅ 2. Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }

        // ✅ 3. Generate OTP
        const otp = genrateOtp();

        await Promise.all([
            // ✅ 4. Store OTP in Redis (5 minutes expiry)
            redisClient.setEx(`otp:${user.email}`, 300, otp),

            // ✅ 5. Store backup OTP in MongoDB (for Redis failover)
            OTP.create({
                email: user.email,
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000
            })
        ]);



        // ✅ 6. Send OTP via email (optional but recommended)
        // await sendEmail(user.email, "Password Change OTP", `Your OTP is: ${otp}`);

        // ✅ 7. Respond
        return res.status(202).json({
            success: true,
            message: 'An OTP has been sent to your registered email'
        });

    } catch (error) {
        console.error('Error in changeUserPassword:', error);
        return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};

