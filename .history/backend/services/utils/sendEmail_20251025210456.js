const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',        // e.g. "smtp.gmail.com"
  port: process.env.SMTP_PORT || 587, // usually 587 or 465
  secure: false,                      // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,      // your email address
    pass: process.env.SMTP_PASS,      // your email app password
  },
});

exports.sendEmail = async(email, message, subject) => {
        
        console.log(`📩 Sending OTP to ${email}`);

        try {
            await transporter.sendMail({
                from: `"Innocrede" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `${subject}`,
                html: `${message}`,
            });

            console.log(`✅ Email sent successfully to ${email}`);
        } catch (err) {
            console.error(`❌ Failed to send OTP to ${email}:`, err.message);
            throw err; // so BullMQ retries
        }
}