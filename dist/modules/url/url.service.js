"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrl = shortenUrl;
exports.resolveUrl = resolveUrl;
exports.getAllUrlDetails = getAllUrlDetails;
exports.shortUrl = shortUrl;
const node_crypto_1 = require("node:crypto");
// import { redis } from "../../config/redis";
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
            //   await redis.set(cacheKey(record.code), record.originalUrl);
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
    // const cachedUrl = await redis.get(cacheKey(code));
    // if (cachedUrl) return cachedUrl;
    const record = await (0, url_repository_1.findUrlByCode)(code);
    if (!record)
        return null;
    // await redis.set(cacheKey(code), record.originalUrl);
    return record;
}
async function getAllUrlDetails() {
    // const cachedUrl = await redis.get(cacheKey(code));
    // if (cachedUrl) return cachedUrl;
    const record = (await (0, url_repository_1.AllUrlDetails)()) ?? null;
    if (!record)
        return null;
    // await redis.set(cacheKey(code), record.originalUrl);
    return record;
}
function shortUrl(code) {
    return `${env_1.env.BASE_URL}/${code}`;
}
//# sourceMappingURL=url.service.js.map