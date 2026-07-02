"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const item_validator_1 = require("../validators/item.validator");
const common_validator_1 = require("../validators/common.validator");
const search_validator_1 = require("../validators/search.validator");
const item_container_1 = __importDefault(require("../container/item.container"));
const router = (0, express_1.Router)();
// Inventory routes handle the CRUD lifecycle for stock items and their soft-delete behavior.
// Publicly view inventory items once the user is authenticated.
router.get("/", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(search_validator_1.paginationSchema, "query"), item_container_1.default.list);
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), item_container_1.default.getById);
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(item_validator_1.createItemSchema, "body"), item_container_1.default.create);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), (0, validate_middleware_1.validate)(item_validator_1.updateItemSchema, "body"), item_container_1.default.update);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), item_container_1.default.remove);
router.patch("/:id/restore", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), (0, validate_middleware_1.validate)(common_validator_1.idSchema, "params"), item_container_1.default.restore);
exports.default = router;
