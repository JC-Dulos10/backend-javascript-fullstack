import { AuditAction } from "@prisma/client";
import { z } from "zod";

export const auditQuerySchema = z.object({
  action: z.nativeEnum(AuditAction).optional(),
});
