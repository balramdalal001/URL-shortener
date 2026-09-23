"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserInputSchema = void 0;
const zod_1 = require("zod");
const UserRouteParamsSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive()
});
exports.CreateUserInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100)
});
const UserSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100)
});
const allUsersSchema = zod_1.z.array(UserSchema);
//# sourceMappingURL=usersSpecs.js.map