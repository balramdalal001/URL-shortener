"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrl = createUrl;
exports.findUrlByCode = findUrlByCode;
exports.AllUrlDetails = AllUrlDetails;
const database_1 = require("../../config/database");
function toUrlRecord(row) {
    return {
        id: row.id,
        code: row.short_code,
        originalUrl: row.original_url,
        createdAt: row.created_at,
        is_active: row.is_active
    };
}
async function createUrl(code, originalUrl) {
    const result = await database_1.database.query("INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING id, short_code, original_url, created_at, is_active", [code, originalUrl]);
    return toUrlRecord(result.rows[0]);
}
async function findUrlByCode(code) {
    const result = await database_1.database.query("SELECT id, short_code, original_url, created_at, is_active FROM urls WHERE short_code = $1 AND is_active = true", [code]);
    return result.rows[0] ? toUrlRecord(result.rows[0]) : null;
}
async function AllUrlDetails() {
    const result = await database_1.database.query("SELECT id, short_code, original_url, created_at, is_active FROM urls WHERE is_active = true");
    return result.rows.map(toUrlRecord);
}
//# sourceMappingURL=url.repository.js.map