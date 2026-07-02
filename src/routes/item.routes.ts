import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createItemSchema, updateItemSchema } from "../validators/item.validator";
import { idSchema } from "../validators/common.validator";
import { paginationSchema } from "../validators/search.validator";
import itemController from "../container/item.container";

const router = Router();

// Inventory routes handle the CRUD lifecycle for stock items and their soft-delete behavior.
// Publicly view inventory items once the user is authenticated.
router.get(
  "/",
  authMiddleware,
  validate(paginationSchema, "query"),
  itemController.list
);

router.get(
  "/:id",
  authMiddleware,
  validate(idSchema, "params"),
  itemController.getById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(createItemSchema, "body"),
  itemController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(idSchema, "params"),
  validate(updateItemSchema, "body"),
  itemController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(idSchema, "params"),
  itemController.remove
);

router.patch(
  "/:id/restore",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(idSchema, "params"),
  itemController.restore
);

export default router;
