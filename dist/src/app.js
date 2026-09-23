"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const v1_1 = __importDefault(require("./mudules/user/routes/v1"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/test", (_req, res) => {
    return res.send("Main server is working perfectly!");
});
app.use(v1_1.default);
const server = http_1.default.createServer(app);
const port = 3000;
server.listen(port, "127.0.0.1", () => {
    console.log(`Connection successful... Listening on http://127.0.0.1:${port}`);
});
module.exports = server;
//# sourceMappingURL=app.js.map