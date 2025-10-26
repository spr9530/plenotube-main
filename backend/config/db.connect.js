const mongoose = require('mongoose');
const User = require('../services/user/user.schema');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        // const user = await User.find();
        // user.forEach(async(u) => await User.findByIdAndDelete(u._id));
        // console.log('de;eted')
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;