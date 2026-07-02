import { AuditRepository } from "../repositories/audit.repository";

// The audit service exposes the read-side of the activity log for administrators.
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  /**
   * Return the latest audit log entries.
   */
  async listAuditLogs() {
    const logs = await this.auditRepository.findMany();

    return logs;
  }
}
