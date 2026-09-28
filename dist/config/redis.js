"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});
redisClient.on("connect", () => {
    console.log("Redis connected.");
});
redisClient.on("ready", () => {
    console.log("Redis ready");
});
redisClient.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});
exports.default = redisClient;
//# sourceMappingURL=redis.js.map