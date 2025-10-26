const cron = require('node-cron');
const User = require('../user/user.schema');
const nodemailer = require("nodemailer");
const { Queue, Worker } = require('bullmq');
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

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.OTPQueue = new Queue('sending-otp', {
    connection: redisClient
})

const sendOtpMail = new Worker('sending-otp',
    async (job) => {
        const { email, otp, full_name } = job.data;
        console.log(`📩 Sending OTP to ${email}`);

        await transporter.sendMail({
            from: `"Innocrede" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your OTP Code",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 16px">
          <h2>Hello ${full_name || "User"} 👋</h2>
          <p>Your OTP is:</p>
          <h3 style="color: #007bff">${otp}</h3>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
        });
         console.log(`✅ Email sent successfully to ${email}`);
    },
    { connection: redisClient, concurrency: 5 }
);


