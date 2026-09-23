"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.loginUser = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("./user.schema");
const user_service_1 = require("./user.service");
const auth_1 = require("../../middleware/auth");
const env_1 = require("../../config/env");
const JWT_REFRESH_SECRET = env_1.env.JWT_REFRESH_SECRET;
const JWT_SECRET = env_1.env.JWT_SECRET;
const createUser = async (req, res, next) => {
    try {
        const input = user_schema_1.userCreateSchema.safeParse(req.body);
        if (!input.success) {
            res.status(400).json({ error: input.error.flatten() });
            return;
        }
        const record = await (0, user_service_1.newUser)(input.data);
        res.status(201).json(record);
    }
    catch (error) {
        return next(error);
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    try {
        // Validate request structure
        const input = user_schema_1.userLoginSchema.safeParse(req.body);
        if (!input.success) {
            res.status(400).json({ error: input.error.flatten() });
            return;
        }
        // Call service to find user and verify credentials
        const user = await (0, user_service_1.verifyUser)(input.data);
        // Safety check: Use a generic message so attackers don't know 
        // whether the email or the password was incorrect.
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const payload = {
            userId: user.id,
            email: user.email,
            role: 'user',
        };
        const token = (0, auth_1.generateToken)(payload);
        const refresh = (0, auth_1.refreshToken)(payload);
        // Best Practice: Send refresh token via a secure HttpOnly cookie
        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: false, // Requires HTTPS server in production; set to true in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        // Success response
        res.status(200).json({
            message: "Login successful",
            token: token
        });
    }
    catch (error) {
        return next(error); // Forward database or systemic errors to global middleware
    }
};
exports.loginUser = loginUser;
const refresh = async (req, res, next) => {
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(403).json({ message: 'Refresh token invalid or revoked' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        // Fetch user details from database using decoded.userId
        const user = await (0, user_service_1.getUserById)(decoded?.userId);
        const userPayload = { userId: decoded.userId, email: user.email, role: 'user' };
        // Issue a fresh short-lived access token
        const newAccessToken = jsonwebtoken_1.default.sign(userPayload, JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        res.status(403).json({ message: 'Refresh token expired' });
    }
};
exports.refresh = refresh;
//# sourceMappingURL=user.controller.js.map