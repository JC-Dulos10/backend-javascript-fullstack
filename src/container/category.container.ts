import { CategoryController } from "../controllers/category.controller";
import { CategoryRepository } from "../repositories/category.repository";
import { AuditRepository } from "../repositories/audit.repository";
import { CategoryService } from "../services/category.service";

const categoryRepository = new CategoryRepository();
const auditRepository = new AuditRepository();

const categoryService = new CategoryService(categoryRepository, auditRepository);
const categoryController = new CategoryController(categoryService);

export default categoryController;
