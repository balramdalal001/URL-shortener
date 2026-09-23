"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUrls = exports.getOriginalUrlDetails = exports.redirectToOriginal = exports.createShortUrl = void 0;
const url_schema_1 = require("./url.schema");
const url_service_1 = require("./url.service");
const createShortUrl = async (req, res, next) => {
    try {
        const input = url_schema_1.createUrlSchema.safeParse(req.body);
        if (!input.success) {
            res.status(400).json({ error: input.error.flatten() });
            return;
        }
        const record = await (0, url_service_1.shortenUrl)(input.data.url);
        res.status(201).json(record);
    }
    catch (error) {
        next(error);
    }
};
exports.createShortUrl = createShortUrl;
const redirectToOriginal = async (req, res, next) => {
    try {
        const record = await (0, url_service_1.resolveUrl)(req.params.code);
        if (!record?.originalUrl) {
            res.status(404).json({ error: "Short URL not found" });
            return;
        }
        res.redirect(record.originalUrl);
    }
    catch (error) {
        next(error);
    }
};
exports.redirectToOriginal = redirectToOriginal;
const getOriginalUrlDetails = async (req, res, next) => {
    try {
        const record = await (0, url_service_1.resolveUrl)(req.params.code);
        if (!record?.originalUrl) {
            res.status(404).json({ error: "URL not found" });
            return;
        }
        res.json(record);
    }
    catch (error) {
        next(error);
    }
};
exports.getOriginalUrlDetails = getOriginalUrlDetails;
const getAllUrls = async (req, res, next) => {
    try {
        const record = await (0, url_service_1.getAllUrlDetails)();
        if (!record) {
            res.status(404).json({ error: "URL not found" });
            return;
        }
        res.json(record);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUrls = getAllUrls;
//# sourceMappingURL=url.controller.js.map