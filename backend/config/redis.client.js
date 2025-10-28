const IORedis = require("ioredis");
require("dotenv").config();

const redisClient = new IORedis({
  host: process.env.HOST,
  port: process.env.REDIS_PORT,
  password: process.env.PASSWORD,
  username: "default", // optional depending on Redis setup
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

module.exports = redisClient;
