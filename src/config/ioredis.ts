import { Redis } from "ioredis";

export const redisConnection = new Redis({
  host: process.env.IOREDIS_HOST || "localhost",
  port: parseInt(process.env.IOREDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null,
});

redisConnection.on("ready", () => {
  console.log("🔴 Redis READY");
});