import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/ioredis";
import XLSX from "xlsx";

const worker = new Worker(
  "customer-excel-processing",

  async (job: Job) => {
    console.log(`Processing job ${job.id}`);

    const {
      filePath,
      originalName,
    } = job.data;

    console.log("File:", originalName);
    console.log("Path:", filePath);

    // Read Excel
    const workbook = XLSX.readFile(filePath);

    // Get first sheet
    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel → JSON
    const rows = XLSX.utils.sheet_to_json<any[]>(worksheet);
    console.log("Total rows:", rows.length);

    for (const row of rows) {
      console.log(row);

      // TODO:
      // Insert row into PostgreSQL
    }

    console.log(`Job ${job.id} completed`);
  },

  {
    connection: redisConnection,

    // Number of jobs this worker can process simultaneously
    concurrency: 3,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error
  );
});