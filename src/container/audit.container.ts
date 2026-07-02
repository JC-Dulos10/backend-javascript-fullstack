import { AuditController } from "../controllers/audit.controller";
import { AuditRepository } from "../repositories/audit.repository";
import { AuditService } from "../services/audit.service";

const auditRepository = new AuditRepository();
const auditService = new AuditService(auditRepository);
const auditController = new AuditController(auditService);

export default auditController;
