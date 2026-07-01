import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;