import IORedis from "ioredis";
export const redisConnection = new IORedis({
    username: 'default',
    password: process.env.PASSWORD,
    socket: {
        host: process.env.HOST,
        port: process.env.REDIS_PORT
    }
});

redisConnection.on("connect", () => console.log("✅ BullMQ Redis Connected"));
redisConnection.on("error", (err) => console.error("❌ BullMQ Redis Error:", err));