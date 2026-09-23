"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createUser_1 = require("../model/createUser");
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    console.log("Someone visited the site!");
    res.send("Hello World! The server is responding.");
});
router.post("/createUser", async (req, res) => {
    const insertedUser = await (0, createUser_1.createUser)(req.body);
    res.status(201).json(insertedUser);
});
router.get("/userList/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
        res.status(400).json({ error: "User id must be an integer" });
        return;
    }
    const userDetails = await (0, createUser_1.getUser)(userId);
    res.json(userDetails);
});
router.get("/userList", async (req, res) => {
    const userDetails = await (0, createUser_1.getUserList)();
    res.json(userDetails);
});
router.put("/updateUser/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
        res.status(400).json({ error: "User id must be an integer" });
        return;
    }
    if (!userId) {
        res.status(400).json({ error: "User not found" });
        return;
    }
    const userDetails = await (0, createUser_1.updateUser)(userId, req.body);
    res.json(userDetails);
});
exports.default = router;
