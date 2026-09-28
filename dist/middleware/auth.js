"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.authenticateJWT = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const JWT_SECRET = env_1.env.JWT_SECRET;
const JWT_REFRESH_SECRET = env_1.env.JWT_REFRESH_SECRET;
// 1. Helper to generate a token
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
// 2. Middleware to authenticate requests
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization token missing or malformed' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify token and cast the decoded object to our custom UserPayload interface
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach the user data to the request object for downstream routes to use
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateJWT = authenticateJWT;
// 1. Helper to refresh a token
const refreshToken = (payload) => {
    return jsonwebtoken_1.default.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, { expiresIn: '7 days' });
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.js.map