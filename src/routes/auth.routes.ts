import { Router } from "express";

import authController from "../container/auth.container";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema } from "../validators/auth.validator";
import { loginSchema } from "../validators/login.validator";

const router = Router();

// Auth endpoints are grouped together so the app can expose a consistent API surface.
// Register a new account.
router.post(
  "/register",
  validate(registerSchema, "body"),
  authController.register
);

// Sign in with a username and password to receive a JWT.
router.post(
  "/login",
  validate(loginSchema, "body"),
  authController.login
);

// Return the currently authenticated user's profile.
router.get("/me", authMiddleware, authController.me);

// In a token-based system, logout is typically handled on the client side.
router.post("/logout", authMiddleware, authController.logout);

export default router;