
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

exports.generateAccountSecurityCode = async (req, res) => {
  try {
    const user = req.user;
    const  accountType  = req.query.platform;
    console.log(accountType)

    if (!user) {
      return res.status(401).json({ message: 'User not authorised', success: false });
    }

    if (!accountType || !['Instagram', 'Youtube', 'Facebook'].includes(accountType)) {
      return res.status(400).json({ message: 'Invalid or missing accountType', success: false });
    }

    // ✅ Generate 7–9 character alphanumeric code
    const length = Math.floor(Math.random() * 3) + 7;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let generatedSecurityKey = '';
    for (let i = 0; i < length; i++) {
      generatedSecurityKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // // ✅ Push new linkedAccount entry
    // const updatedUser = await User.findByIdAndUpdate(
    //   user.userid,
    //   {
    //     $push: {
    //       linkedAccount: {
    //         accountType,
    //         verificationCode: generatedSecurityKey,
    //         status: 'Pending',
    //       },
    //     },
    //   },
    //   { new: true }
    // );

    // if (!updatedUser) {
    //   return res.status(404).json({ message: 'User not found', success: false });
    // }

    res.status(201).json({
      message: `Security code generated for ${accountType}`,
      success: true,
      verificationCode: generatedSecurityKey,
    });

  } catch (error) {
    console.error('Error generating security code:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};
