import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import itemRoutes from "./routes/item.routes";
import categoryRoutes from "./routes/category.routes";
import auditRoutes from "./routes/audit.routes";
import docsRoutes from "./routes/docs.routes";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

// Build the Express application and mount each feature router under its API prefix.
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Authentication and business routes are registered here.
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/docs", docsRoutes);



app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory API is running.",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorMiddleware);


export default app;