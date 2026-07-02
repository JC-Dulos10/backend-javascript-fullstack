import { NextFunction, Request, Response } from "express";

import { AuditService } from "../services/audit.service";

export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * List recent audit log entries.
   */
  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.auditService.listAuditLogs();

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };
}
