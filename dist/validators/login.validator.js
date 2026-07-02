"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
// Validation rules for the login endpoint.
exports.loginSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters."),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters."),
});
