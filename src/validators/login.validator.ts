import { z } from "zod";

// Validation rules for the login endpoint.
export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});