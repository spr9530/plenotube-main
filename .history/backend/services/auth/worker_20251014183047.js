const cron = require('node-cron');
const User = require('../user/user.schema');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('🕒 Unverified user cleanup cron started');

  try {
    // Calculate 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Find users that are not verified and were created more than 5 minutes ago
    const unVerifiedUsers = await User.find({
      isVerified: false,
      createdAt: { $lt: fiveMinutesAgo },
    });

    if (unVerifiedUsers.length > 0) {
      // Delete them one by one or use Promise.all for parallel deletion
      await Promise.all(
        unVerifiedUsers.map((user) => User.findByIdAndDelete(user._id))
      );
      console.log(`🗑️ Deleted ${unVerifiedUsers.length} unverified users`);
    } else {
      console.log('✅ No unverified users found to delete');
    }
  } catch (error) {
    console.error('❌ Error in unverified user cron:', error);
  }

  console.log('✅ Unverified user cron completed');
});
