"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Validation rules for the registration endpoint.
exports.registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must not exceed 20 characters."),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number."),
    role: zod_1.z.nativeEnum(client_1.Role),
});
// Validation rules for the login endpoint.
//
// IMPORTANT:
// The existing unit tests (src/validators/__tests__/auth.validator.spec.ts) import
// `loginSchema` and expect it to be *less strict than registration*.
// So for login we only enforce basic shape + minimal length constraints.
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3, "Username must be at least 3 characters."),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters."),
});
