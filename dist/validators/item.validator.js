"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemSchema = exports.createItemSchema = void 0;
const zod_1 = require("zod");
// Validation rules for item create and update requests.
exports.createItemSchema = zod_1.z.object({
    sku: zod_1.z.string().trim().min(2, "SKU must be at least 2 characters.").max(50),
    name: zod_1.z.string().trim().min(2, "Item name must be at least 2 characters.").max(100),
    description: zod_1.z.string().trim().max(500).nullable().optional(),
    quantity: zod_1.z.coerce.number().int().nonnegative("Quantity must be zero or greater."),
    receivedAt: zod_1.z.string().datetime({ offset: true }).optional(),
    categoryId: zod_1.z.coerce.number().int().positive("Category ID must be a positive integer."),
});
exports.updateItemSchema = exports.createItemSchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
