const express = require('express');
const { getCurrentUserInfo } = require('./user.controller');

const user_router = express.Router();

// To Do :- Authentication before end routes
user_router.get('/get-userinfo/:id', getCurrentUserInfo);

module.exports = user_router;

