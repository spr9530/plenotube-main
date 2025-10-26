const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db.connect');
const user_router  = require('./user/user.router.js');
const auth_router = require('./auth/auth.router.js');

//Config
dotenv.config();
const app = express();

connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/user', user_router);



module.exports = app;


