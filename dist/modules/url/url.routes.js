"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRouter = void 0;
const express_1 = __importDefault(require("express"));
const url_controller_1 = require("./url.controller");
const auth_1 = require("../../middleware/auth");
exports.urlRouter = express_1.default.Router();
exports.urlRouter.post("/v1/urls", auth_1.authenticateJWT, url_controller_1.createShortUrl);
exports.urlRouter.get("/v1/urls/:code", auth_1.authenticateJWT, url_controller_1.redirectToOriginal);
exports.urlRouter.get("/v1/geturls/:code", auth_1.authenticateJWT, url_controller_1.getOriginalUrlDetails);
exports.urlRouter.get("/v1/getAllurls", auth_1.authenticateJWT, url_controller_1.getAllUrls);
//# sourceMappingURL=url.routes.js.map