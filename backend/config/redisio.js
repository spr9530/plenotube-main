const IORedis = require("ioredis");
const dotenv = require('dotenv');

dotenv.config();

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
