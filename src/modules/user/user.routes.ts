import express from "express";
import { createUser,loginUser,refresh } from "./user.controller";
import { authLimiter } from '../../middleware/authLimiter';
export const userRouter = express.Router();

userRouter.post("/v1/auth/register", createUser);
userRouter.post("/v1/auth/login", authLimiter, loginUser);
userRouter.get("/v1/auth/refresh", refresh);