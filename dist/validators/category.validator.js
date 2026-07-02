"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
// Validation rules for category create and update requests.
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Category name must be at least 2 characters.").max(100),
    description: zod_1.z.string().trim().max(500).nullable().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
