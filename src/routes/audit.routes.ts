import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import auditController from "../container/audit.container";

const router = Router();

// Audit routes are restricted to administrators so sensitive activity history stays protected.
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), auditController.list);

export default router;
