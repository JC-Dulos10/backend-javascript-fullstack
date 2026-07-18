"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.auditQuerySchema = zod_1.z.object({
    action: zod_1.z.nativeEnum(client_1.AuditAction).optional(),
});
