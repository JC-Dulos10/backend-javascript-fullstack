import { z } from "zod";
import { Role } from "@prisma/client";

// Validation rules for the registration endpoint.
export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),

  role: z.nativeEnum(Role),
});

// Validation rules for the login endpoint.
//
// IMPORTANT:
// The existing unit tests (src/validators/__tests__/auth.validator.spec.ts) import
// `loginSchema` and expect it to be *less strict than registration*.
// So for login we only enforce basic shape + minimal length constraints.
export const loginSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
