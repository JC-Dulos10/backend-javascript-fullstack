import { Router } from "express";

import userController from "../container/user.container";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { idSchema } from "../validators/common.validator";
import { userListQuerySchema } from "../validators/user.validator";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), validate(userListQuerySchema, "query"), userController.list);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), validate(idSchema, "params"), userController.remove);

export default router;
