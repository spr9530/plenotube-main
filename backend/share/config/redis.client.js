const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = createClient({
  username: 'default',
  password: process.env.PASSWORD,
  socket: {
    host: process.env.HOST,
    port: process.env.REDIS_PORT
  }
});


redisClient.on("error", (err) => console.error("❌ Redis error:", err));
redisClient.on("connect", () => console.log("✅ Redis connected"));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
