const { genrateOtp } = require('../utils/genrateOtp.js');
const redisClient = require('../../config/redis.client.js');
const User = require('./user.schema.js');
const OTP = require('../../common/otp.model.schema.js');
const { sendEmail } = require('../utils/sendEmail.js');

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

    const userInfo = await User.findById(user.userid);

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

    const existingUser = await User.findById(user.userId);
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

    const otp = generateOtp(); 
    const emailKey = `mail_change_otp:${user.userId}`;

    await redisClient.setEx(emailKey, 300, otp);

    await OTP.create({
      otp,
      email,
      userId: user.userId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
    });

    // ✅ 7. Send OTP email (mock or actual)
    await sendEmail(email, `<div style="font-family: Arial, sans-serif; padding: 16px">
                        <h2>Hello ${existingUser.full_name || "User"} 👋</h2>
                        <p>Your OTP is:</p>
                        <h3 style="color: #007bff">${otp}</h3>
                        <p>This code will expire in 5 minutes.</p>
                    </div>`, 'Your OTP for email change ');

    return res.status(200).json({
      message: 'OTP sent successfully to your new email',
      success: true
    });

  } catch (error) {
    console.error('Error in sendEmailChangeOtp:', error);
    res.status(500).json({ message: 'Server Error', success: false });
  }
};