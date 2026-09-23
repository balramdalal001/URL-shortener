"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, _req, res, _next) => {
    const appError = error;
    const statusCode = appError.statusCode ?? 500;
    const message = appError.message || "Internal server error";
    console.error(error);
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map