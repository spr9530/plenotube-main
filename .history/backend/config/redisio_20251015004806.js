const IORedis = require("ioredis");
const dotenv = require('dotenv');

dotenv.config();

console.log({
    username: 'default',                // default for Redis Cloud
    password: process.env.PASSWORD,     // store securely in env
    socket: {
        host: process.env.HOST,         // Redis host
        port: process.env.REDIS_PORT    // Redis port
    },
    maxRetriesPerRequest: null,
})

const redisConnection = new IORedis({
  username: 'default',
  password: process.env.PASSWORD,   // better to keep in env
  host: process.env.HOST,           // cloud host
  port: process.env.REDIS_PORT,   // must be a number
  maxRetriesPerRequest: null,             // required for BullMQ
  enableOfflineQueue: true                // optional, good practice
});

redisConnection.on("connect", () => console.log("✅ BullMQ Redis Connected"));
redisConnection.on("error", (err) => console.error("❌ BullMQ Redis Error:", err));

module.exports = redisConnection;       // ✅ export it
