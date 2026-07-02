import { z } from "zod";

// Validation rules for item create and update requests.
export const createItemSchema = z.object({
  sku: z.string().trim().min(2, "SKU must be at least 2 characters.").max(50),
  name: z.string().trim().min(2, "Item name must be at least 2 characters.").max(100),
  description: z.string().trim().max(500).nullable().optional(),
  quantity: z.coerce.number().int().nonnegative("Quantity must be zero or greater."),
  receivedAt: z.string().datetime({ offset: true }).optional(),
  categoryId: z.coerce.number().int().positive("Category ID must be a positive integer."),
});

export const updateItemSchema = createItemSchema.partial().extend({
  isActive: z.boolean().optional(),
});
