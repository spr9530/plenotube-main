const User = require('../user/user.schema.js')
const bcryptjs = require('bcryptjs');
const { genrateOtp } = require('../utils/genrateOtp.js');
const OTP = require('../../common/otp.model.schema.js');
const redisClient = require('../../config/redis.client.js');
const { jwt } = require('jsonwebtoken');

exports.createNewAccount = async (req, res) => {

    try {
        const { full_name, username, email, password } = req.body;

        // Validate input
        if (!full_name || !username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check existing user
        const user = await User.findOne({ $and: [{ username }, { email }] });
        console.log(user)
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(13);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            full_name,
            email,
            username,
            password: hashedPassword,
        });

        // Generate OTP
        const otp = genrateOtp();

        await Promise.all([
            // Save OTP in Redis (5 mins)
            await redisClient.setEx(`otp:${email}`, 300, otp),
            // Backup in MongoDB for recovery
            await OTP.create({
                email,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            })
        ]);

        // TODO: send OTP via email (e.g. nodemailer)

        res.json({
            success: true,
            message: "Account created successfully. An OTP has been sent to your registered email.",
        });
    } catch (error) {
        console.error("❌ Error in user signup:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

exports.verifySignUpOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        // 1️⃣ Try fetching OTP from Redis cache
        const cacheOtp = await redisClient.get(`otp:${email}`);

        if (cacheOtp) {
            // Redis found the OTP
            if (otp === cacheOtp) {
                // OTP matched — cleanup both Redis + DB
                await redisClient.del(`otp:${email}`);
                await OTP.deleteOne({ email });

                return res.json({ success: true, message: "OTP verified successfully" });
            } else {
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }
        }

        // 2️⃣ Fallback to MongoDB (if Redis empty or restarted)
        const backupOtp = await OTP.findOne({ email });
        if (!backupOtp) {
            return res.status(400).json({ success: false, message: "OTP expired or not found" });
        }

        // Expiry check
        if (backupOtp.expiresAt < Date.now()) {
            await OTP.deleteOne({ email }); // clean up expired
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // Compare OTP
        if (otp !== backupOtp.otp) {
            return res.status(400).json({ success: false, message: "OTP mismatched" });
        }

        // ✅ OTP verified (via DB fallback)
        await OTP.deleteOne({ email });
        return res.json({ success: true, message: "OTP verified successfully (via DB fallback)" });
    } catch (error) {
        console.error("❌ Error verifying signup OTP:", error);
        return res.status(500).json({ success: false, message: "Server error" });
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

