const cron = require('node-cron');
const User = require('../user/user.schema');
const {Queue, Worker} = require('bullmq');
const redisClient = require('../../config/redis.client');

// // Run every 5 minutes
// cron.schedule('*/5 * * * *', async () => {
//   console.log('🕒 Unverified user cleanup cron started');

//   try {
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

//     const unVerifiedUsers = await User.find({
//       isVerified: false,
//       createdAt: { $lt: fiveMinutesAgo },
//     });

//     if (unVerifiedUsers.length > 0) {
//       await Promise.all(
//         unVerifiedUsers.map((user) => User.findByIdAndDelete(user._id))
//       );
//       console.log(`🗑️ Deleted ${unVerifiedUsers.length} unverified users`);
//     } else {
//       console.log('✅ No unverified users found to delete');
//     }
//   } catch (error) {
//     console.error('❌ Error in unverified user cron:', error);
//   }

//   console.log('✅ Unverified user cron completed');
// });

const OTPQueue = new Queue('sending-otp',{
    connection: redisClient
})


