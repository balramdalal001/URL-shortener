"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const authLimiter_1 = require("../../middleware/authLimiter");
const auth_1 = require("../../middleware/auth");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/v1/auth/register", user_controller_1.createUser);
exports.userRouter.post("/v1/auth/login", authLimiter_1.authLimiter, user_controller_1.loginUser);
exports.userRouter.get("/v1/auth/refresh", user_controller_1.refresh);
exports.userRouter.post("/v1/upload", auth_1.authenticateJWT, user_controller_1.bulkUpload);
//# sourceMappingURL=user.routes.js.map