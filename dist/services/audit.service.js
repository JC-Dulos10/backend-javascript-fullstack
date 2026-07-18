"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
// The audit service exposes the read-side of the activity log for administrators.
class AuditService {
    auditRepository;
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    /**
     * Return the latest audit log entries, optionally filtered by action.
     */
    async listAuditLogs(action) {
        const logs = await this.auditRepository.findMany(action);
        return logs;
    }
}
exports.AuditService = AuditService;
