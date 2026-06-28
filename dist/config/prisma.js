"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const prisma = new client_1.PrismaClient({
    log: ["query", "warn", "error"],
    // prisma@7's PrismaClient in this repo expects accelerateUrl; keep it optional via env.
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL ?? "",
});
exports.default = prisma;
