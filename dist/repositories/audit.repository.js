"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const base_repository_1 = require("./base.repository");
class AuditRepository extends base_repository_1.BaseRepository {
    /**
     * Create an audit log entry.
     */
    async create(data) {
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
exports.AuditRepository = AuditRepository;
