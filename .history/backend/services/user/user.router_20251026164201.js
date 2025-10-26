const express = require('express');
const { getCurrentUserInfo, getUserGeneral, updateUserGeneral, sendEmailChangeOtp, verifyEmailChangeOtp, updatePassword, updatePasswordSecurityKey } = require('./user.controller');
const { authenticate } = require('../../middelware/authorization');

const user_router = express.Router();

// To Do :- Authentication before end routes
user_router.get('/get-userinfo/:id', authenticate, getCurrentUserInfo);
user_router.get('/genral-info', authenticate, getUserGeneral);
user_router.post('/genral-info/update', authenticate, updateUserGeneral);
user_router.post('/update-user-mail', authenticate, sendEmailChangeOtp);
user_router.post('/verify-update-user-mail', authenticate, verifyEmailChangeOtp)
user_router.get('/generate-session', authenticate, updatePasswordSecurityKey)
user_router.post('/update-user-password', authenticate, updatePassword)

module.exports = user_router;

