const { required } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index:true},
  password: { type: String },
  full_name: { type: String, required: true },
  username:{type: String, required: true, unique:true, index:true},
  phone:{type: String, unique:true},
  isVerified:{type:Boolean, default:false, required:true},
  linkedAccount:[
    {type: mongoose.Schema.Types.ObjectId, ref:'Account'}
  ],
  bio:{type: String},
  createdAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);
module.exports = User ;
