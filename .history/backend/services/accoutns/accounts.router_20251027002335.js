const express = require('express');
const { submitInstagramProfile } = require('./accounts.controller');

const account_router = express.Router();

account_router.get('/genrate-account-security-code', generateAccountSecurityCode)
account_router.post('/submit-profile-link/instagram', submitInstagramProfile);

module.exports = account_router;
// account_router.post('/submit-profile/youtube');
// account_router.post('/sbumit-profile/facebook');