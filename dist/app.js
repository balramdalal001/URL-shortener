"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const url_routes_1 = require("./modules/url/url.routes");
const user_routes_1 = require("./modules/user/user.routes");
const error_handler_1 = require("./middleware/error-handler");
const rateLimiter_1 = require("./middleware/rateLimiter");
exports.app = (0, express_1.default)();
const multer_1 = __importDefault(require("multer"));
// const upload = multer({ 
//   storage: multer.memoryStorage(),
// }).any();
// when we are using diskStorage, we can use the path to read the file, but when we are using memoryStorage, we need to read the file from the buffer.
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
}).single("file"); // Use .single() for single file upload, or .array() for multiple files
//allows routes or middleware to access cookies
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
// Apply the rate limiting middleware globally to all routes
exports.app.use(rateLimiter_1.globalLimiter);
exports.app.use(upload); // Apply multer middleware globally to handle file uploads
exports.app.get("/health", (_req, res) => res.json({ status: "ok" }));
exports.app.use(url_routes_1.urlRouter);
exports.app.use(user_routes_1.userRouter);
exports.app.use(error_handler_1.errorHandler);
//# sourceMappingURL=app.js.map