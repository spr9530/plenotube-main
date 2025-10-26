const IORedis = require("ioredis");

const redisConnection = new IORedis({
    username: 'default',                // default for Redis Cloud
    password: process.env.PASSWORD,     // store securely in env
    socket: {
        host: process.env.HOST,         // Redis host
        port: process.env.REDIS_PORT    // Redis port
    }
});

redisConnection.on("connect", () => console.log("✅ BullMQ Redis Connected"));
redisConnection.on("error", (err) => console.error("❌ BullMQ Redis Error:", err));

module.exports = redisConnection;       // ✅ export it
