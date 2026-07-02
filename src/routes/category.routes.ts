import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";
import { idSchema } from "../validators/common.validator";
import categoryController from "../container/category.container";

const router = Router();

// Category routes expose the lookup and management operations for the inventory taxonomy.
router.get("/", authMiddleware, categoryController.list);

router.get(
  "/:id",
  authMiddleware,
  validate(idSchema, "params"),
  categoryController.getById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(createCategorySchema, "body"),
  categoryController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(idSchema, "params"),
  validate(updateCategorySchema, "body"),
  categoryController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(idSchema, "params"),
  categoryController.remove
);

export default router;
