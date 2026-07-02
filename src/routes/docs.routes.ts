import { Router } from "express";

import docsController from "../container/docs.container";

const router = Router();

// Simple documentation endpoint for quickly reviewing the available API surface.
router.get("/", docsController.getDocs);

export default router;
