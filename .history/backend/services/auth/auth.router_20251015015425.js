const express = require('express');
const { createNewAccount, verifySignUpOtp, loginUserAccount, changeUserPassword } = require('./auth.controller');

const auth_router = express.Router();

auth_router.post('/sign-up', createNewAccount);
auth_router.post('/verify-otp', verifySignUpOtp);
auth_router.post('/sing-in', loginUserAccount);
auth_router.post('/forgot-password', changeUserPassword)

module.exports = auth_router;
