import { Router } from "express";

import docsController from "../container/docs.container";

const router = Router();

// Serve the interactive Swagger UI page and expose the OpenAPI document for it.
router.get("/", docsController.getDocs);
router.get("/swagger.json", docsController.getSpec);

export default router;
