// queues/verificationQueue.js
const { Queue, Worker } = require('bullmq');
const axios = require('axios');
const cheerio = require('cheerio');
const redisClient = require('../../config/redis.client.js');
const User = require('../user/user.schema.js');

// 1️⃣ Create the queue
const verificationQueue = new Queue('instagram-verification', {
  connection: redisClient
});

// 2️⃣ Worker to process verification jobs
const worker = new Worker(
  'instagram-verification',
  async job => {
    const { userId, profileUrl, code, accountType } = job.data;
    try {
      const response = await axios.get(profileUrl, { timeout: 5000 });
      const $ = cheerio.load(response.data);
      const bio = $('meta[name="description"]').attr('content') || '';

      const status = bio.includes(code) ? 'Verified' : 'Rejected';

      // Update the user's linked account status
      await User.updateOne(
        { _id: userId, 'linkedAccount.accountType': accountType, 'linkedAccount.verificationCode': code },
        { $set: { 'linkedAccount.$.status': status } }
      );

      // Remove code from Redis
      await redisClient.del(`inst_verify:${userId}`);
      return { success: status === 'Verified', status };
    } catch (err) {
      console.error('Instagram verification error:', err.message);

      await User.updateOne(
        { _id: userId, 'linkedAccount.accountType': accountType, 'linkedAccount.verificationCode': code },
        { $set: { 'linkedAccount.$.status': 'Failed' } }
      );

      throw err;
    }
  },
  { connection: redisClient, concurrency: 50 } 
);

module.exports = verificationQueue;
