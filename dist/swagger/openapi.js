"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
// OpenAPI document used by the Swagger UI page.
exports.swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Inventory Management API",
        version: "1.0.0",
        description: "Inventory API with JWT authentication, admin-managed account registration, category-filtered items, and action-filtered audit logs.",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server",
        },
    ],
    tags: [
        { name: "Auth", description: "Admin-managed registration, login, and profile endpoints" },
        { name: "Items", description: "Inventory item management" },
        { name: "Categories", description: "Category management" },
        { name: "Audit", description: "Administrative activity logs" },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Validation failed." },
                    data: { nullable: true },
                },
            },
            RegisterRequest: {
                type: "object",
                required: ["username", "password", "role"],
                properties: {
                    username: { type: "string", minLength: 3, example: "demouser" },
                    password: { type: "string", minLength: 8, example: "Demo1234" },
                    role: { type: "string", enum: ["ADMIN", "USER"], example: "USER" },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string", example: "admin" },
                    password: { type: "string", example: "Admin123" },
                },
            },
            ItemCreateRequest: {
                type: "object",
                required: ["sku", "name", "quantity", "categoryId"],
                properties: {
                    sku: { type: "string", example: "ITM001" },
                    name: { type: "string", example: "Laptop" },
                    description: { type: "string", nullable: true, example: "Gaming laptop" },
                    quantity: { type: "integer", minimum: 0, example: 10 },
                    receivedAt: { type: "string", format: "date-time", example: "2026-07-03T00:00:00.000Z" },
                    categoryId: { type: "integer", example: 1 },
                },
            },
            CategoryCreateRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Electronics" },
                    description: { type: "string", nullable: true, example: "Electronic devices" },
                },
            },
        },
    },
    paths: {
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user (admin only)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "User registered successfully" },
                    "400": { description: "Validation failed" },
                    "401": { description: "Missing or invalid token" },
                    "403": { description: "Admin role required" },
                },
            },
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Log in and receive a JWT",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Login successful" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/api/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get the current authenticated user's profile",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Authenticated user profile" },
                    "401": { description: "Missing or invalid token" },
                },
            },
        },
        "/api/items": {
            get: {
                tags: ["Items"],
                summary: "List inventory items",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer" }, description: "Page number" },
                    { name: "limit", in: "query", schema: { type: "integer" }, description: "Items per page" },
                    { name: "search", in: "query", schema: { type: "string" }, description: "Search by name, SKU, or description" },
                    { name: "categoryId", in: "query", schema: { type: "integer", minimum: 1 }, description: "Filter by category ID" },
                ],
                responses: {
                    "200": { description: "List of items" },
                },
            },
            post: {
                tags: ["Items"],
                summary: "Create a new item",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ItemCreateRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Item created successfully" },
                    "401": { description: "Missing or invalid token" },
                },
            },
        },
        "/api/items/{id}": {
            get: {
                tags: ["Items"],
                summary: "Get one item by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    "200": { description: "Item details" },
                    "404": { description: "Item not found" },
                },
            },
            put: {
                tags: ["Items"],
                summary: "Update an item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    "200": { description: "Item updated" },
                    "404": { description: "Item not found" },
                },
            },
            delete: {
                tags: ["Items"],
                summary: "Delete an item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    "200": { description: "Item deleted" },
                    "404": { description: "Item not found" },
                },
            },
        },
        "/api/categories": {
            get: {
                tags: ["Categories"],
                summary: "List categories",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Category list" },
                },
            },
            post: {
                tags: ["Categories"],
                summary: "Create a category",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CategoryCreateRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Category created" },
                    "401": { description: "Missing or invalid token" },
                },
            },
        },
        "/api/audit": {
            get: {
                tags: ["Audit"],
                summary: "List audit logs, optionally filtered by action",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "action",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["LOGIN", "REGISTER", "CREATE_ITEM", "UPDATE_ITEM", "DELETE_ITEM", "RESTORE_ITEM"],
                        },
                    },
                ],
                responses: {
                    "200": { description: "Audit log entries" },
                    "401": { description: "Missing or invalid token" },
                    "403": { description: "Forbidden" },
                },
            },
        },
    },
};
