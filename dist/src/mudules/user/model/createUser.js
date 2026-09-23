"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUser = getUser;
exports.getUserList = getUserList;
exports.updateUser = updateUser;
const db_1 = require("../../../config/db");
async function createUser(body) {
    const result = await db_1.pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, password", [body.name, body.email, body.password]);
    return result.rows[0];
}
async function getUser(id) {
    const result = await db_1.pool.query("SELECT * FROM users where id=$1", [id]);
    return result.rows[0];
}
async function getUserList() {
    const result = await db_1.pool.query("SELECT * FROM users");
    return result.rows;
}
async function updateUser(id, body) {
    const result = await db_1.pool.query("UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING id, name, email", [body.name, body.email, body.password, id]);
    return result.rows[0];
}
//# sourceMappingURL=createUser.js.map