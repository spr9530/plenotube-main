const { genrateOtp } = require('../utils/genrateOtp.js');
const redisClient = require('../../config/redis.client.js');
const User = require('./user.schema.js');
const OTP = require('../../common/otp.model.schema.js');
const { sendEmail } = require('../utils/sendEmail.js');
const bcryptjs = require('bcryptjs');

exports.getCurrentUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ success: false, message: 'Not user found' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Not user found' });
    }

    return res.status(200).json({ success: true, message: 'User Found', user });

  } catch (error) {
    console.log('Error while getting current userinfo fn:getCurrentUserInfo', error);
    return res.status(500).json('Server Error');
  }
}

exports.getUserGeneral = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const userInfo = await User.findById(user.userid).populate('linkedAccount');

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'User found successfully',
      user: userInfo,
      success: true,
    });

  } catch (error) {
    console.error('Error occurred while fetching user info (getUserGeneral):', error);
    return res.status(500).json({ message: 'Server Error', success: false });
  }
};

exports.updateUserGeneral = async (req, res) => {
  try {
    const user = req.user;
    const { full_name, email, phone, bio } = req.body;
    if (!user) {
      return res.status(400).json({ message: 'User not authenticated', success: false });
    }

    const updatedUser = await User.findByIdAndUpdate(user.userid, { full_name, email, phone, bio }, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'Updated successfully!',
      user: updatedUser,
      success: true
    });

  } catch (error) {
    console.error('Error in updateUserGeneral:', error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message
    });
  }
}

exports.sendEmailChangeOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = req.user;

    if (!email) {
      return res.status(400).json({ message: 'Email is required', success: false });
    }

    if (!user || !user.userid) {
      return res.status(401).json({ message: 'Not authenticated', success: false });
    }

    const existingUser = await User.findById(user.userid);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    if (existingUser.email === email) {
      return res.status(400).json({ message: 'New email must be different from current email', success: false });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(400).json({ message: 'Email already registered', success: false });
    }

    // Generate new OTP
    const otp = genrateOtp();
    console.log("Generated OTP:", otp);

    // Redis Key for rate limiting & quick verification
    const emailKey = `mail_change_otp:${user.userid}`;

    // Store OTP in Redis (overwrite if exists)
    await redisClient.setEx(emailKey, 420, otp); // 7 minutes

    // Also persist OTP in MongoDB (for logs or backup)
    const existingOtpDoc = await OTP.findOne({ email });

    if (existingOtpDoc) {
      existingOtpDoc.otp = otp;
      existingOtpDoc.email = email;
      existingOtpDoc.expiresAt = new Date(Date.now() + 7 * 60 * 1000);
      await existingOtpDoc.save();
    } else {
      await OTP.create({
        otp,
        email,
        userId: user.userid,
        expiresAt: new Date(Date.now() + 7 * 60 * 1000)
      });
    }

    // Send OTP via Email
    await sendEmail(
      email,
      `
      <div style="font-family: Arial, sans-serif; padding: 16px">
        <h2>Hello ${existingUser.full_name || "User"} 👋</h2>
        <p>Your OTP for changing your email is:</p>
        <h3 style="color: #007bff">${otp}</h3>
        <p>This code will expire in <b>7 minutes</b>.</p>
      </div>
      `,
      'Your OTP for Email Change'
    );

    return res.status(200).json({
      message: 'OTP sent successfully to your new email',
      success: true
    });

  } catch (error) {
    console.error('Error in sendEmailChangeOtp:', error);
    res.status(500).json({ message: 'Server Error', success: false });
  }
};

exports.verifyEmailChangeOtp = async (req, res) => {
  try {
    const { newemail, email, otp } = req.body;
    const user = req.user;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required', success: false });
    }

    if (!user || !user.userid) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const emailKey = `mail_change_otp:${user.userid}`;
    console.log(emailKey);
    const storedOtp = await redisClient.get(emailKey);
    if (storedOtp && storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP', success: false });
    }

    const otpRecord = await OTP.findOne({ email: newemail }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(404).json({ message: 'OTP record not found', success: false });
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired', success: false });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP', success: false });
    }

    // 5️⃣ Update email in User model
    const updatedUser = await User.findByIdAndUpdate(
      user.userid,
      { email: newemail },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update email', success: false });
    }

    // 6️⃣ Clean up Redis and Mongo
    await redisClient.del(emailKey);
    await OTP.deleteMany({ userId: user.userid }); // remove used OTPs

    // 7️⃣ Respond success
    return res.status(200).json({
      message: 'Email updated successfully!',
      user: updatedUser,
      success: true
    });

  } catch (error) {
    console.error('Error in verifyEmailChangeOtp:', error);
    res.status(500).json({ message: 'Server Error', success: false });
  }
};

// exports.updatePasswordSecurityKey = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user || !user.userid) {
//       return res.status(401).json({
//         message: 'User not authenticated',
//         success: false
//       });
//     }

//     const securityKey = `${user.userid}_${Math.floor(Math.random() * 100000)}_${Date.now()}`;

//     res.cookie('PasswordSecurityKey', securityKey, {
//       httpOnly: true, 
//       secure: process.env.NODE_ENV === 'production', 
//       sameSite: 'Strict', 
//       maxAge: 5 * 60 * 1000 
//     });

//     return res.status(200).json({
//       message: 'Password security key generated successfully',
//       success: true
//     });

//   } catch (error) {
//     console.log('Error occurred while generating security key (updatePasswordSecurityKey)', error);
//     res.status(500).json({ message: 'Server Error', success: false });
//   }
// };

exports.updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { newPassword, oldPassword } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'User not authenticated', success: false });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new passwords are required', success: false });
    }

    const userInfo = await User.findById(user.userid);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    if (userInfo.password == '') {
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);

      const updatedUser = await User.findByIdAndUpdate(
        user.userid,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update password', success: false });
      }

      return res.status(200).json({
        message: 'Password updated successfully',
        success: true
      });
    }
    
    const isMatched = await bcryptjs.compare(oldPassword, userInfo.password);
    if (!isMatched) {
      return res.status(400).json({ message: 'Old password is incorrect', success: false });
    }

    const isSameAsOld = await bcryptjs.compare(newPassword, userInfo.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: 'New password cannot be the same as old password', success: false });
    }

    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      user.userid,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update password', success: false });
    }

    return res.status(200).json({
      message: 'Password updated successfully',
      success: true
    });

  } catch (error) {
    console.error('Error in updatePassword:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

