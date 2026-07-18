"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const docs_routes_1 = __importDefault(require("./routes/docs.routes"));
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
// Build the Express application and mount each feature router under its API prefix.
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Authentication and business routes are registered here.
app.use("/api/auth", auth_routes_1.default);
app.use("/api/items", item_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/audit", audit_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/docs", docs_routes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Inventory API is running.",
        timestamp: new Date().toISOString(),
    });
});
// 404 handler
app.use(notFound_middleware_1.notFoundMiddleware);
// Global error handler (must be last)
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
