
const { Queue, Worker } = require("bullmq");
const { redisConnection } = require("../../config/redisio.js");

exports.OTPQueue = new Queue("sending-otp", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
    },
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',        // e.g. "smtp.gmail.com"
  port: process.env.SMTP_PORT || 587, // usually 587 or 465
  secure: false,                      // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,      // your email address
    pass: process.env.SMTP_PASS,      // your email app password
  },
});

new Worker(
    "sending-otp",
    async (job) => {
        const { email, otp, full_name } = job.data;
        console.log(`📩 Sending OTP to ${email}`);

        try {
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
        } catch (err) {
            console.error(`❌ Failed to send OTP to ${email}:`, err.message);
            throw err; // so BullMQ retries
        }
    },
    {
        connection: redisConnection,
        concurrency: 5,
        limiter: { max: 20, duration: 1000 },
    }
);
