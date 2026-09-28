import { Queue } from "bullmq";

import { redisConnection } from "../config/ioredis";

export const excelQueue = new Queue("customer-excel-processing", {
  connection: redisConnection,
});