"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_container_1 = __importDefault(require("../container/user.container"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const common_validator_1 = require("../validators/common.validator");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(user_validator_1.userListQuerySchema, "query"), user_container_1.default.list);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), user_container_1.default.remove);
exports.default = router;
