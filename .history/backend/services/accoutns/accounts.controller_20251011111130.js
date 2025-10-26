
const User = require("../user/user.schema");
const crypto = require("crypto");
const verificationQueue = require("./worker");
const redisClient = require("../../config/redis.client");


exports.submitInstagramProfile = async (req, res) => {
  try {
    const { profileLink } = req.body;
    const user = req.user; // from auth middleware

    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!profileLink) return res.status(400).json({ success: false, message: 'Profile link required' });

    // 1️⃣ Generate a unique verification code
    const verificationCode =
      user.name.slice(0, 3).toUpperCase() +
      crypto.randomInt(0, 1e6).toString().padStart(6, '0');

    // 2️⃣ Update linkedAccount array in user document
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          linkedAccount: {
            accountType: 'Instagram',
            verificationCode,
            status: 'Pending',
            profileLink,
          },
        },
      },
      { new: true }
    );

    // 4️⃣ Add verification job to async queue
    await verificationQueue.add(`verify:${user._id}`, {
      userId: user._id,
      profileUrl: profileLink,
      code: verificationCode,
      accountType: 'Instagram',
    });

    return res.status(200).json({
      success: true,
      message: 'Instagram profile submitted. Verification in progress.',
      verificationCode,
    });
  } catch (error) {
    console.error('Error in submitInstagramProfile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};