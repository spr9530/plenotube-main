const express = require('express');
const { generateAccountSecurityCode, submitSocialProfile } = require('./accounts.controller');
const { authenticate } = require('../../middelware/authorization');

const account_router = express.Router();

account_router.get('/genrate-account-security-code',authenticate , generateAccountSecurityCode);
account_router.post('/submit-profile-link',authenticate, submitSocialProfile);

module.exports = account_router;
// account_router.post('/submit-profile/youtube');
// account_router.post('/sbumit-profile/facebook');