"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = addUser;
exports.login = login;
exports.getUserDetails = getUserDetails;
const database_1 = require("../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function addUser(body) {
    try {
        //check email exist or not
        const checkEmail = await database_1.database.query("SELECT * FROM users WHERE email = $1", [body.email]);
        if (checkEmail.rows.length > 0) {
            throw new Error("Email already exists");
        }
        // 1. Generate salt rounds and hash the password
        const saltRounds = 12; // Balanced workload factor for modern hardware
        const hashedPassword = await bcrypt_1.default.hash(body.password, saltRounds);
        const result = await database_1.database.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at, password_hash", [body.email, hashedPassword]);
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}
async function login(body) {
    try {
        const result = await database_1.database.query("SELECT id, email, password_hash, created_at FROM users WHERE email = $1", [body.email]);
        const user = result.rows[0];
        if (!user) {
            throw new Error("Invalid email.");
            ; // User not found
        }
        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt_1.default.compare(body.password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error("Invalid password."); // Invalid password
        }
        return user; // Successful login
    }
    catch (error) {
        throw error;
    }
}
async function getUserDetails(userId) {
    try {
        const result = await database_1.database.query("SELECT id, email FROM users WHERE id = $1", [userId]);
        const user = result.rows[0];
        if (!user) {
            throw new Error("Invalid user ID."); // User not found
        }
        return user;
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=user.repository.js.map