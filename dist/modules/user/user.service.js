"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUser = newUser;
exports.verifyUser = verifyUser;
exports.getUserById = getUserById;
exports.handleBulkUpload = handleBulkUpload;
const user_repository_1 = require("./user.repository");
const xlsx_1 = __importDefault(require("xlsx"));
const excel_queue_1 = require("../../queues/excel.queue");
// const cacheKey = (code: string) => `url:${code}`;
async function newUser(body) {
    try {
        await (0, user_repository_1.addUser)(body);
        //   await redis.set(cacheKey(record.code), record.originalUrl);
        return { message: "User created successfully" };
    }
    catch (error) {
        throw error;
    }
}
async function verifyUser(body) {
    try {
        const record = await (0, user_repository_1.login)(body);
        //   await redis.set(cacheKey(record.code), record.originalUrl);
        if (!record || record.id === undefined || record.email === undefined) {
            throw new Error("Invalid user record");
        }
        return {
            id: String(record.id),
            email: String(record.email),
            message: "User verified successfully",
        };
    }
    catch (error) {
        throw error;
    }
}
async function getUserById(userId) {
    try {
        const record = await (0, user_repository_1.getUserDetails)(userId);
        //   await redis.set(cacheKey(record.code), record.originalUrl);
        if (!record || record.id === undefined || record.email === undefined) {
            throw new Error("Invalid user record");
        }
        return record;
    }
    catch (error) {
        throw error;
    }
}
async function handleBulkUpload(userId, files) {
    try {
        if (!files || (Array.isArray(files) && files.length === 0)) {
            throw new Error("No file uploaded.");
        }
        const file = files; // Assuming single file upload, adjust if multiple files are expected
        // 2. Access the file properties
        const fileName = file?.originalname; // Example: "photo.jpg"
        // const savedPath = file?.path;         // Example: "uploads/abc123xyz"
        const fileSize = file?.size; // Size in bytes
        const mimeType = file?.mimetype; // Example: "image/jpeg"
        console.log(`Uploaded ${fileName}`);
        if (!file) {
            throw new Error("Excel file is required");
        }
        const workbook = xlsx_1.default.readFile(file.path); // not getting path using memoryStorage
        // const workbook = XLSX.read(file.buffer, { type: "buffer"});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx_1.default.utils.sheet_to_json(worksheet);
        console.log(data);
        const job = await excel_queue_1.excelQueue.add("process-excel", {
            filePath: file?.path
        });
        return { queued: true, jobId: job?.id, message: "File uploaded and queued for processing" };
        // await createCustomer(filePath);
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=user.service.js.map