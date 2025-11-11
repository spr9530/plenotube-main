// utils/uploadImageToCloudinary.js
const { cloudinary } = require('../../config/cloudinary'); // ✅ use the configured v2 instance

/**
 * Upload image buffer or path to Cloudinary
 * @param {Buffer|String} fileBuffer - image file buffer (from multer.memoryStorage)
 * @param {String} folder - Cloudinary folder name
 */
const uploadImageToCloudinary = async (fileBuffer, folder = 'campaigns') => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // ✅ Pipe the buffer to Cloudinary
      stream.end(fileBuffer);
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    return { success: false, message: error.message };
  }
};

module.exports = uploadImageToCloudinary;
