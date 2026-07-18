import { AuditAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import { AuditService } from "../services/audit.service";

export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * List recent audit log entries.
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const action = typeof req.query.action === "string"
        ? req.query.action as AuditAction
        : undefined;
      const logs = await this.auditService.listAuditLogs(action);

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };
}
