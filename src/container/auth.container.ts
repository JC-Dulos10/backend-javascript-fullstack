import { AuthController } from "../controllers/auth.controller";
import { UserRepository } from "../repositories/user.repository";
import { AuditRepository } from "../repositories/audit.repository";
import { AuthService } from "../services/auth.service";

const userRepository = new UserRepository();
const auditRepository = new AuditRepository();

const authService = new AuthService(userRepository, auditRepository);

const authController = new AuthController(authService);

export default authController;
