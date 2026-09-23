import express from "express";
import cookieParser from 'cookie-parser';
import { urlRouter } from "./modules/url/url.routes";
import { userRouter } from "./modules/user/user.routes";
import { errorHandler } from "./middleware/error-handler";
import { globalLimiter } from './middleware/rateLimiter';
export const app = express();
app.use(cookieParser());
app.use(express.json());
// Apply the rate limiting middleware globally to all routes
app.use(globalLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(urlRouter);
app.use(userRouter);
app.use(errorHandler);