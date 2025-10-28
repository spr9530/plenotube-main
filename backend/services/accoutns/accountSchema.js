const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    username: { type: String, trim: true },
    accountType: {
        type: String,
        enum: ['Instagram', 'Youtube', 'Facebook'],
        required: true
    },
    verificationCode: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Processing', 'Not Verified', 'Rejected', 'Failed'],
        default: 'Pending'
    },
    profileLink: { type: String, trim: true },
    lastSecurityCodeTime: { type: Date, default: Date.now }
}, { timestamps: true });


const Account = mongoose.model('Account', accountSchema);
module.exports = Account;