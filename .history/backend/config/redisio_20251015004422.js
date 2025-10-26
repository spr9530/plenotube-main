const IORedis = require("ioredis");
const dotenv = require('dotenv');

dotenv.config();

const redisConnection = new IORedis({
    username: 'default',                // default for Redis Cloud
    password: process.env.PASSWORD,     // store securely in env
    socket: {
        host: process.env.HOST,         // Redis host
        port: process.env.REDIS_PORT    // Redis port
    },
    maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => console.log("✅ BullMQ Redis Connected"));
redisConnection.on("error", (err) => console.error("❌ BullMQ Redis Error:", err));

module.exports = redisConnection;       // ✅ export it
