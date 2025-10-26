const express = require('express');
const { createNewAccount, verifySignUpOtp, loginUserAccount, changeUserPassword, createAccountViaGoogle } = require('./auth.controller');
const jwt = require('jsonwebtoken');
const auth_router = express.Router();

auth_router.get('/get-me', (req, res) => {
    const { user } = req.cookies;
    console.log(req.cookies)
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(user.token, process.env.JWT_SECRET);
        res.json({ authenticated: true, user: user.info });
    } catch (err) {
        res.status(401).json({ authenticated: false, message: "Unauthorized" });
    }
})
auth_router.post('/sign-up', createNewAccount);
auth_router.post('/sign-up-google', createAccountViaGoogle)
auth_router.post('/verify-otp', verifySignUpOtp);
auth_router.post('/sing-in', loginUserAccount);
auth_router.post('/forgot-password', changeUserPassword)

module.exports = auth_router;
