"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const category_validator_1 = require("../validators/category.validator");
const common_validator_1 = require("../validators/common.validator");
const category_container_1 = __importDefault(require("../container/category.container"));
const router = (0, express_1.Router)();
// Category routes expose the lookup and management operations for the inventory taxonomy.
router.get("/", auth_middleware_1.authMiddleware, category_container_1.default.list);
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), category_container_1.default.getById);
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(category_validator_1.createCategorySchema, "body"), category_container_1.default.create);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), (0, validate_middleware_1.validate)(category_validator_1.updateCategorySchema, "body"), category_container_1.default.update);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), category_container_1.default.remove);
exports.default = router;
