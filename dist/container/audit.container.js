"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audit_controller_1 = require("../controllers/audit.controller");
const audit_repository_1 = require("../repositories/audit.repository");
const audit_service_1 = require("../services/audit.service");
const auditRepository = new audit_repository_1.AuditRepository();
const auditService = new audit_service_1.AuditService(auditRepository);
const auditController = new audit_controller_1.AuditController(auditService);
exports.default = auditController;
