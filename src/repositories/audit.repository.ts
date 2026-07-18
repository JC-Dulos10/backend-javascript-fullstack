import { AuditAction, Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";

export class AuditRepository extends BaseRepository {
  /**
   * Create an audit log entry.
   */
  async create(data: Prisma.AuditLogCreateInput) {
    return this.getDb().auditLog.create({
      data,
      include: {
        user: { select: { id: true, username: true, role: true } },
      },
    });
  }

  /**
   * List audit logs in reverse chronological order.
   */
  async findMany(action?: AuditAction) {
    return this.getDb().auditLog.findMany({
      where: action ? { action } : undefined,
      orderBy: { performedAt: "desc" },
      include: {
        user: { select: { id: true, username: true, role: true } },
      },
    });
  }
}
