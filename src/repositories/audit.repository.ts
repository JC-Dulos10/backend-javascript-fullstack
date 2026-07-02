import { Prisma } from "@prisma/client";

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
  async findMany() {
    return this.getDb().auditLog.findMany({
      orderBy: { performedAt: "desc" },
      include: {
        user: { select: { id: true, username: true, role: true } },
      },
    });
  }
}
