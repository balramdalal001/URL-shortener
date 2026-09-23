"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createUser_1 = require("../model/createUser");
const usersSpecs_1 = require("../specs/usersSpecs");
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    console.log("Someone visited the site!");
    res.send("Hello World! The server is responding.");
});
router.post("/createUser", async (req, res) => {
    // check if the request body matches the CreateUserInput schema
    const validation = usersSpecs_1.CreateUserInputSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.flatten() });
        return;
    }
    const insertedUser = await (0, createUser_1.createUser)(validation.data);
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
router.put("/updateUser/:id", async (req, res, next) => {
    try {
        const validation = usersSpecs_1.CreateUserInputSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ error: validation.error.flatten() });
            return;
        }
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId)) {
            res.status(400).json({ error: "User id must be an integer" });
            return;
        }
        ////if your ID is 999 but user 999 doesn't exist in the database, this condition won't detect it.
        // if (!userId) {
        //   res.status(400).json({ error: "User not found" });
        //   return;
        // }
        const userDetails = await (0, createUser_1.updateUser)(userId, validation.data);
        //if your ID is 999 but user 999 doesn't exist in the database, this condition won't detect it.
        if (!userDetails) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(userDetails);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=v1.js.map