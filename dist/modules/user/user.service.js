"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUser = newUser;
exports.verifyUser = verifyUser;
exports.getUserById = getUserById;
const user_repository_1 = require("./user.repository");
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
//# sourceMappingURL=user.service.js.map