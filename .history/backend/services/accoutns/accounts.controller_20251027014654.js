
const User = require("../user/user.schema");
const crypto = require("crypto");
const verificationQueue = require("./worker");
const redisClient = require("../../config/redis.client");


exports.submitInstagramProfile = async (req, res) => {
  try {
    const { profileLink, verificationCode } = req.body;
    const accountType = req.query.platform;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!profileLink) return res.status(400).json({ success: false, message: 'Profile link required' });

    const updatedUser = await User.findByIdAndUpdate(
      user.userid,
      {
        $push: {
          linkedAccount: {
            accountType,
            verificationCode,
            status: 'Pending',
            profileLink
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

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
    const accountType = req.query.platform;

    if (!user) return res.status(401).json({ message: 'User not authorised', success: false });
    if (!accountType) return res.status(400).json({ message: 'Account type required', success: false });

    const userData = await User.findById(user.userid);
    if (!userData) return res.status(404).json({ message: 'User not found', success: false });

    let pendingAccount = userData.linkedAccount.find(acc => acc.accountType === accountType && acc.status === 'Pending');

    // Cooldown: 2 minutes
    if (pendingAccount?.lastSecurityCodeTime && Date.now() - pendingAccount.lastSecurityCodeTime < 2 * 60 * 1000) {
      return res.status(429).json({ message: 'Please wait 2 minutes before regenerating code.', success: false });
    }

    // Generate 7–9 char alphanumeric code
    const length = Math.floor(Math.random() * 3) + 7;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let generatedSecurityKey = '';
    for (let i = 0; i < length; i++) {
      generatedSecurityKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    let updatedUser;
    if (pendingAccount) {
      // Update existing pending account
      updatedUser = await User.findOneAndUpdate(
        { _id: user.userid, 'linkedAccount.accountType': accountType, 'linkedAccount.status': 'Pending' },
        {
          $set: {
            'linkedAccount.$.verificationCode': generatedSecurityKey,
            'linkedAccount.$.lastSecurityCodeTime': Date.now(),
          },
        },
        { new: true }
      );
    } else {
      // Add new pending account
      updatedUser = await User.findByIdAndUpdate(
        user.userid,
        {
          $push: {
            linkedAccount: {
              accountType,
              verificationCode: generatedSecurityKey,
              status: 'Pending',
              lastSecurityCodeTime: Date.now(),
            },
          },
        },
        { new: true }
      );
    }

    return res.status(201).json({
      message: `Security code generated for ${accountType}`,
      success: true,
      verificationCode: generatedSecurityKey,
    });

  } catch (error) {
    console.error('Error generating security code:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};


