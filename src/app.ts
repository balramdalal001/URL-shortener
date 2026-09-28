import express from "express";
import cookieParser from 'cookie-parser';
import { urlRouter } from "./modules/url/url.routes";
import { userRouter } from "./modules/user/user.routes";
import { errorHandler } from "./middleware/error-handler";
import { globalLimiter } from './middleware/rateLimiter';
export const app = express();

import multer from "multer";

// const upload = multer({ 
//   storage: multer.memoryStorage(),
// }).any();

// when we are using diskStorage, we can use the path to read the file, but when we are using memoryStorage, we need to read the file from the buffer.

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
}).single("file"); // Use .single() for single file upload, or .array() for multiple files

//allows routes or middleware to access cookies
app.use(cookieParser());

app.use(express.json());
// Apply the rate limiting middleware globally to all routes
app.use(globalLimiter);

app.use(upload); // Apply multer middleware globally to handle file uploads

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(urlRouter);
app.use(userRouter);
app.use(errorHandler);