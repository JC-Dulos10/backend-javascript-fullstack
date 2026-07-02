"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsController = void 0;
/**
 * Provide a lightweight OpenAPI-like payload for the API.
 * This keeps the documentation endpoint simple and easy to study.
 */
class DocsController {
    getDocs = (_req, res) => {
        return res.status(200).json({
            openapi: "3.0.0",
            info: {
                title: "Inventory Management API",
                version: "1.0.0",
            },
            paths: {
                "/api/auth/register": {
                    post: { summary: "Register a new account" },
                },
                "/api/auth/login": {
                    post: { summary: "Sign in and receive a JWT token" },
                },
                "/api/auth/me": {
                    get: { summary: "Get the authenticated user profile" },
                },
                "/api/items": {
                    get: { summary: "List inventory items" },
                    post: { summary: "Create a new inventory item" },
                },
                "/api/categories": {
                    get: { summary: "List categories" },
                    post: { summary: "Create a new category" },
                },
                "/api/audit": {
                    get: { summary: "List audit logs" },
                },
            },
        });
    };
}
exports.DocsController = DocsController;
