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
cloudinary.connectCloudinary()

//Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'], // allowed origins
  credentials: true // allow cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/user', user_router, account_router);
app.use('/api/v1/user/campaign', campaign_router)



module.exports = app;


