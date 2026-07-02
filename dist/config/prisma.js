"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Create one Prisma client instance for the application to reuse across repositories.
const prisma = new client_1.PrismaClient({
    log: ["query", "warn", "error"],
});
exports.default = prisma;
