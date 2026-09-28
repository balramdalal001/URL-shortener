"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrl = shortenUrl;
exports.resolveUrl = resolveUrl;
exports.getAllUrlDetails = getAllUrlDetails;
exports.shortUrl = shortUrl;
const node_crypto_1 = require("node:crypto");
const redis_1 = __importDefault(require("../../config/redis"));
const env_1 = require("../../config/env");
const url_repository_1 = require("./url.repository");
const cacheKey = (code) => `url:${code}`;
function generateCode() {
    return (0, node_crypto_1.randomBytes)(4).toString("base64url");
}
async function shortenUrl(originalUrl) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
            const record = await (0, url_repository_1.createUrl)(generateCode(), originalUrl);
            //expire the cache after 5 minutes
            await redis_1.default.set(cacheKey(record.code), JSON.stringify(record), {
                EX: 300
            });
            return record;
        }
        catch (error) {
            if (attempt === 4)
                throw error;
        }
    }
    throw new Error("Unable to create short URL");
}
async function resolveUrl(code) {
    const cachedValue = await redis_1.default.get(cacheKey(code));
    if (cachedValue) {
        return JSON.parse(cachedValue);
    }
    const record = await (0, url_repository_1.findUrlByCode)(code);
    if (!record) {
        throw new Error("Short URL not found");
    }
    await redis_1.default.set(cacheKey(code), JSON.stringify(record), {
        EX: 300
    });
    return record;
}
async function getAllUrlDetails() {
    let key = "allUrls";
    const cachedValue = await redis_1.default.get(cacheKey(key));
    if (cachedValue) {
        return JSON.parse(cachedValue);
    }
    const record = (await (0, url_repository_1.AllUrlDetails)()) ?? null;
    if (!record)
        return null;
    await redis_1.default.set(cacheKey(key), JSON.stringify(record), {
        EX: 300
    });
    return record;
}
function shortUrl(code) {
    return `${env_1.env.BASE_URL}/${code}`;
}
//# sourceMappingURL=url.service.js.map