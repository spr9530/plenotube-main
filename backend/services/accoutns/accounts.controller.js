
const User = require("../user/user.schema");
const crypto = require("crypto");
const verificationQueue = require("./worker");
const redisClient = require("../../config/redis.client");
const Account = require("./accountSchema");


exports.submitSocialProfile = async (req, res) => {
  try {
    const { profileLink, verificationCode } = req.body;
    const accountType = req.query.platform;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!profileLink) return res.status(400).json({ success: false, message: 'Profile link required' });
    if (!verificationCode) return res.status(400).json({ success: false, message: 'Verification code required' });
    if (!accountType) return res.status(400).json({ success: false, message: 'Account type required' });

    const userData = await User.findById(user.userid).populate('linkedAccount');
    console.log(userData)
    if (!userData) return res.status(404).json({ success: false, message: 'User not found' });

    // Find the pending account in the Account collection
    const userAccounts = await Account.find({ _id: { $in: userData.linkedAccount } });

    console.log(userAccounts)
    // Check for duplicate link in user's accounts
    const existingLink = userAccounts.find(acc => (
      acc.accountType === accountType &&
      acc.profileLink === profileLink
    ))

    if (existingLink && ['Processing', 'Verified'].includes(existingLink.status)) {
      return res.status(400).json({
        success: false,
        message: `Profile link is already ${existingLink.status.toLowerCase()}`,
      });
    }
    else if (existingLink && ['Rejected', 'Failed'].includes(existingLink.status)) {
      console.log('Account existed', existingLink.status);

      // Update the account
      // need to improve that if user send its own verification code that s different from db 
      await Account.findByIdAndUpdate(existingLink._id, {
        status: 'Processing',
        verificationCode
      }, { new: true })

      // Add verification job
      await verificationQueue.add(`verify-profile:${user.userid}`, {
        userId: user.userid,
        profileUrl: profileLink,
        platform: accountType,
        code: verificationCode,
        email: userData.email,
        accountId: existingLink._id,
      });

      userData.linkedAccount.forEach((acc) => {
        if (acc._id.toString() === existingLink._id.toString()) {
          acc.status = 'Processing';
          acc.verificationCode = verificationCode
        }
      });



      console.log(userData.linkedAccount);

      return res.status(200).json({
        success: true,
        message: `${accountType} profile submitted. Verification is again in progress.`,
        verificationCode,
        user: userData,
      });
    }

    let pendingAccount = userAccounts.find(
      acc => (
        acc.accountType === accountType &&
        acc.status === 'Pending' &&
        acc.verificationCode === verificationCode
      ));

    if (!pendingAccount)
      return res.status(400).json({ success: false, message: 'Invalid verification code or no pending account found' });

    // Extract username from link
    const getUsernameFromLink = (platform, link) => {
      try {
        switch (platform) {
          case 'Instagram':
            return link.split('/').filter(Boolean).pop();
          case 'Facebook':
            return link.split('/').filter(Boolean).pop();
          case 'YouTube': {
            const parts = link.split('/');
            const handle = parts.find(p => p.startsWith('@'));
            return handle ? handle.replace('@', '') : parts.pop();
          }
          default:
            return '';
        }
      } catch {
        return '';
      }
    };

    const username = getUsernameFromLink(accountType, profileLink);

    // Update the account
    await Account.findByIdAndUpdate(pendingAccount._id, {
      status: 'Processing',
      profileLink: profileLink,
      username: username,
    }, { new: true })
    // Add verification job
    await verificationQueue.add(`verify-profile:${user.userid}`, {
      userId: user.userid,
      profileUrl: profileLink,
      platform: accountType,
      code: pendingAccount.verificationCode,
      email: userData.email,
      accountId: pendingAccount._id,
    });

    userData.linkedAccount.forEach((acc) => {
      if (acc._id.toString() === pendingAccount._id.toString()) {
        acc.status = 'Processing';
        acc.profileLink = profileLink;
        acc.username = username;
      }
    });



    console.log(userData.linkedAccount);

    return res.status(200).json({
      success: true,
      message: `${accountType} profile submitted. Verification in progress.`,
      verificationCode,
      user: userData,
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

    const userData = await User.findById(user.userid).populate('linkedAccount');
    if (!userData) return res.status(404).json({ message: 'User not found', success: false });

    let pendingAccount = userData.linkedAccount.find(
      acc => acc.accountType === accountType && acc.status === 'Pending'
    );

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

    let updatedAccount;

    if (pendingAccount) {
      // Update existing pending account
      updatedAccount = await Account.findByIdAndUpdate(
        pendingAccount._id,
        {
          verificationCode: generatedSecurityKey,
          lastSecurityCodeTime: Date.now(),
        },
        { new: true }
      );
    } else {
      // Create new pending account
      const newAccount = await Account.create({
        user: user.userid,
        accountType,
        verificationCode: generatedSecurityKey,
        status: 'Pending',
        lastSecurityCodeTime: Date.now(),
      });

      // Link to user
      await User.findByIdAndUpdate(user.userid, {
        $push: { linkedAccount: newAccount._id }
      });

      updatedAccount = newAccount;
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


