"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(10),
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z.coerce.number().int().positive().optional(),
});
