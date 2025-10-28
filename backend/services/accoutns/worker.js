// queues/verificationQueue.js
const { Queue, Worker } = require('bullmq');
const axios = require('axios');
const cheerio = require('cheerio');
const redisClient = require('../../config/redis.client.js');
const User = require('../user/user.schema.js');
const { getProfileBio } = require('../utils/profileExtracter.js');
const { sendEmail } = require('../utils/sendEmail.js');
const Account = require('./accountSchema.js');

// 1️⃣ Create the queue
const verificationQueue = new Queue('profile-verification-queue', {
  connection: redisClient
});

// 2️⃣ Worker to process verification jobs
const verificationWorker = new Worker(
  'profile-verification-queue',
  async (job) => {
    const { userId, platform, profileUrl, code, email, accountId } = job.data;
    console.log('job start')
    try {
      const bio = await getProfileBio(platform, profileUrl);
      console.log('Bio got: ', bio)

      if (!bio) throw new Error('Failed to extract bio');

      const status = bio.includes(code) ? 'Verified' : 'Rejected';

      await Account.findByIdAndUpdate(accountId, { status }, { new: true });

      if (status === 'Verified') {
        await sendEmail(
          email,
          `Your ${platform} account has been successfully verified.`,
          'Account Verified ✅',
        );
      } else if (status === 'Rejected') {
        await sendEmail(
          email,
          `We couldn’t find your verification code on your ${platform} profile. Please update your bio with the code and try again.`,
          'Account Verification Rejected ❌',
        );
      }

      return { status, platform };
    } catch (err) {
      console.error(`[${platform}] Verification error:`, err.message);
      await Account.findByIdAndUpdate(accountId, { status:'Failed' }, { new: true });
      await sendEmail(
        email,
        'Account Verification Failed ⚠️',
        `We couldn’t verify your ${platform} account due to a technical issue. Please recheck your profile link or try again later.`
      );
      throw err;
    }
  },
  { connection: redisClient }
);


module.exports = verificationQueue;
