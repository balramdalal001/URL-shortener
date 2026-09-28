import { randomBytes } from "node:crypto";
// import { redis } from "../../config/redis";
import { env } from "../../config/env";
import { addUser, login, getUserDetails, createCustomer } from "./user.repository";
import { UserCreateBody, UserLoginBody } from "./user.schema";
import { UserCreateRes, UserLoginRes, UserDetailRes } from "./user.type";

import XLSX from "xlsx";
import { excelQueue } from "../../queues/excel.queue";

// const cacheKey = (code: string) => `url:${code}`;


export async function newUser(body: UserCreateBody): Promise<UserCreateRes> {
  try {
    await addUser(body);
    //   await redis.set(cacheKey(record.code), record.originalUrl);
    return { message: "User created successfully" };
  } catch (error) {
    throw error;
  }
}

export async function verifyUser(body: UserLoginBody): Promise<UserLoginRes> {
  try {
    const record = await login(body);
    //   await redis.set(cacheKey(record.code), record.originalUrl);
    if (!record || record.id === undefined || record.email === undefined) {
      throw new Error("Invalid user record");
    }

    return {
      id: String(record.id),
      email: String(record.email),
      message: "User verified successfully",
    };
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: string): Promise<UserDetailRes> {
  try {
    const record = await getUserDetails(userId);
    //   await redis.set(cacheKey(record.code), record.originalUrl);
    if (!record || record.id === undefined || record.email === undefined) {
      throw new Error("Invalid user record");
    }

    return record;
  } catch (error) {
    throw error;
  }
}

export async function handleBulkUpload(userId: any, files: Express.Multer.File | Express.Multer.File | undefined): Promise<{ queued: boolean; jobId?: string; message?: string }> {
  try {
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new Error("No file uploaded.");
    }

    const file = files as Express.Multer.File; // Assuming single file upload, adjust if multiple files are expected
    // 2. Access the file properties
    const fileName = file?.originalname; // Example: "photo.jpg"
    // const savedPath = file?.path;         // Example: "uploads/abc123xyz"
    const fileSize = file?.size;         // Size in bytes
    const mimeType = file?.mimetype;     // Example: "image/jpeg"

    if (!file) {
      throw new Error("Excel file is required");
    }

    const workbook = XLSX.readFile(file!.path);  // not getting path using memoryStorage

    // const workbook = XLSX.read(file.buffer, { type: "buffer"});

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const job = await excelQueue.add("customer-excel-processing", {
      filePath: file?.path
    });

    return { queued: true, jobId: job?.id, message: "File uploaded and queued for processing" };
  } catch (error) {
    throw error;
  }
}