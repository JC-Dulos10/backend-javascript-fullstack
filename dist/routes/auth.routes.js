"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_container_1 = __importDefault(require("../container/auth.container"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const login_validator_1 = require("../validators/login.validator");
const router = (0, express_1.Router)();
// Auth endpoints are grouped together so the app can expose a consistent API surface.
// Register a new account.
router.post("/register", (0, validate_middleware_1.validate)(auth_validator_1.registerSchema, "body"), auth_container_1.default.register);
// Sign in with a username and password to receive a JWT.
router.post("/login", (0, validate_middleware_1.validate)(login_validator_1.loginSchema, "body"), auth_container_1.default.login);
// Return the currently authenticated user's profile.
router.get("/me", auth_middleware_1.authMiddleware, auth_container_1.default.me);
// In a token-based system, logout is typically handled on the client side.
router.post("/logout", auth_middleware_1.authMiddleware, auth_container_1.default.logout);
exports.default = router;
