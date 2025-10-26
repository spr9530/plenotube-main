const crypto = require('crypto');

exports.genrateOtp = () => {
    const otp = crypto.randomInt(0, Math.pow(10, 6)).toString().padStart(6, '0');
    console.log(otp);
    return otp;
}