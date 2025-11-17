const express = require('express');
const { createNewAccount, verifySignUpOtp, loginUserAccount, changeUserPassword, createAccountViaGoogle, logoutUser } = require('./auth.controller');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../../middelware/authorization');
const auth_router = express.Router();

auth_router.get('/get-me', (req, res) => {
    const rawUser = req.cookies.user;

    if (!rawUser) {
        return res.status(401).json({ authenticated: false, message: "Unauthorized" });
    }

    let user;
    try {
        user = JSON.parse(rawUser);   // << Important
    } catch (err) {
        return res.status(400).json({ authenticated: false, message: "Invalid cookie format" });
    }

    try {
        const decoded = jwt.verify(user.token, process.env.JWT_SECRET);

        return res.json({
            authenticated: true,
            user: user.info,
            token: user.token
        });

    } catch (err) {
        return res.status(401).json({
            authenticated: false,
            message: "Unauthorized"
        });
    }
});

auth_router.post('/sign-up', createNewAccount);
auth_router.post('/sign-up-google', createAccountViaGoogle)
auth_router.post('/verify-otp', verifySignUpOtp);
auth_router.post('/sing-in', loginUserAccount);
auth_router.post('/forgot-password', changeUserPassword)
auth_router.get('/logout',authenticate, logoutUser)

module.exports = auth_router;
