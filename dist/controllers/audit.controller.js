"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
class AuditController {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    /**
     * List recent audit log entries.
     */
    list = async (req, res, next) => {
        try {
            const action = typeof req.query.action === "string"
                ? req.query.action
                : undefined;
            const logs = await this.auditService.listAuditLogs(action);
            return res.status(200).json({
                success: true,
                data: logs,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuditController = AuditController;
