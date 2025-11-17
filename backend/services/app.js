const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db.connect');
const user_router  = require('./user/user.router.js');
const auth_router = require('./auth/auth.router.js');
const cookieParser = require("cookie-parser");
const account_router = require('./accoutns/accounts.router.js');
const campaign_router = require('./campaign/campaign.router.js');
const cloudinary = require('../config/cloudinary.js');

//Config
dotenv.config();
const app = express();

connectDB();
cloudinary.connectCloudinary();

// CORS — FIXED
app.use(cors({
    origin: ['https://plenotube.netlify.app', 'http://localhost:5173'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

// COOP FIX — must ALLOW popups
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/user', user_router, account_router);
app.use('/api/v1/user/campaign', campaign_router);

module.exports = app;
