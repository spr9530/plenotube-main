const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

const connectCloudinary = async () => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("❌ Cloudinary environment variables missing!");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    console.log("✅ Cloudinary connected successfully.");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    process.exit(1); // stop the server if Cloudinary isn't configured properly
  }
};

module.exports = { cloudinary, connectCloudinary };
