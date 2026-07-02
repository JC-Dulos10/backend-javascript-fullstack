"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_container_1 = __importDefault(require("../container/auth.container"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_middleware_1.validate)(auth_validator_1.registerSchema, "body"), auth_container_1.default.register);
exports.default = router;
