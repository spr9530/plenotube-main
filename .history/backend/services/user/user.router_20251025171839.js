const express = require('express');
const { getCurrentUserInfo, getUserGeneral } = require('./user.controller');
const { authenticate } = require('../../middelware/authorization');

const user_router = express.Router();

// To Do :- Authentication before end routes
user_router.get('/get-userinfo/:id',authenticate, getCurrentUserInfo);
user_router.get('/genral-info',authenticate, getUserGeneral);
user_router.post('/genral-info/update', authenticate,updateUserGeneral)

// Assigned to vanshika 
// need to make routes for user information update

module.exports = user_router;

