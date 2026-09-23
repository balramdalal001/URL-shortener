import { ErrorRequestHandler } from "express";

type AppError = Error & { statusCode?: number };

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = error as AppError;
  const statusCode = appError.statusCode ?? 500;
  const message = appError.message || "Internal server error";

  console.error(error);
  res.status(statusCode).json({ error: message });
};
