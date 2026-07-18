"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const audit_validator_1 = require("../validators/audit.validator");
const audit_container_1 = __importDefault(require("../container/audit.container"));
const router = (0, express_1.Router)();
// Audit routes are restricted to administrators so sensitive activity history stays protected.
router.get("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(audit_validator_1.auditQuerySchema, "query"), audit_container_1.default.list);
exports.default = router;
