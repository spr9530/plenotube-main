
const User = require("../user/user.schema");
const crypto = require("crypto");
const verificationQueue = require("./worker");
const redisClient = require("../../config/redis.client");


exports.submitSocialProfile = async (req, res) => {
  try {
    const { profileLink, verificationCode } = req.body;
    const accountType = req.query.platform;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!profileLink) return res.status(400).json({ success: false, message: 'Profile link required' });
    if (!verificationCode) return res.status(400).json({ success: false, message: 'Verification code required' });
    if (!accountType) return res.status(400).json({ success: false, message: 'Account type required' });

    // ✅ Get user
    const userData = await User.findById(user.userid);

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ Check if pending account exists with correct verification code
    const pendingAccount = userData.linkedAccount.find(
      acc => acc.accountType === accountType && acc.status === 'Pending' && acc.verificationCode === verificationCode
    );

    if (!pendingAccount) {
      return res.status(400).json({ success: false, message: 'Invalid verification code or no pending account found' });
    }

    // ✅ Check if profile link is already Processing
    const processingAccount = userData.linkedAccount.find(
      acc => acc.accountType === accountType && acc.profileLink === profileLink && acc.status === 'Processing'
    );

    if (processingAccount) {
      return res.status(400).json({ success: false, message: 'Profile is already under processing' });
    }

    // ✅ Check if profile link is already Verified
    const verifiedAccount = userData.linkedAccount.find(
      acc => acc.accountType === accountType && acc.profileLink === profileLink && acc.status === 'Verified'
    );

    if (verifiedAccount) {
      return res.status(400).json({ success: false, message: 'Profile is already verified' });
    }

    const getUsernameFromLink = (platform, link) => {
      try {
        switch (platform) {
          case 'Instagram':
            // Example: https://www.instagram.com/username/
            return link.split('/').filter(Boolean).pop();
          case 'Facebook':
            // Example: https://www.facebook.com/username/
            return link.split('/').filter(Boolean).pop();
          case 'YouTube':
            // Example: https://www.youtube.com/@username or /channel/abc
            const parts = link.split('/');
            return parts.includes('@') ? parts.pop().replace('@', '') : parts.pop();
          default:
            return '';
        }
      } catch (err) {
        console.error('Error extracting username:', err);
        return '';
      }
    };

    // ✅ Update the account status to 'Processing' and save profile link
    const updatedUser = await User.findOneAndUpdate(
      { _id: user.userid, 'linkedAccount.accountType': accountType, 'linkedAccount.status': 'Pending' },
      {
        $set: {
          'linkedAccount.$.status': 'Processing',
          'linkedAccount.$.profileLink': profileLink,
          'linkedAccount.$.username': getUsernameFromLink(accountType, profileLink),
        }
      },
      { new: true }
    );


    // ✅ Add verification job to async queue
    // await verificationQueue.add(`verify:${user.userid}`, {
    //   userId: user.userid,
    //   profileUrl: profileLink,
    //   code: verificationCode,
    //   accountType,
    // });

    return res.status(200).json({
      success: true,
      message: `${accountType} profile submitted. Verification in progress.`,
      verificationCode,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error in submitSocialProfile:', error);
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


