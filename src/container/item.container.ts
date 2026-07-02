import { ItemController } from "../controllers/item.controller";
import { ItemRepository } from "../repositories/item.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { AuditRepository } from "../repositories/audit.repository";
import { ItemService } from "../services/item.service";

const itemRepository = new ItemRepository();
const categoryRepository = new CategoryRepository();
const auditRepository = new AuditRepository();

const itemService = new ItemService(itemRepository, categoryRepository, auditRepository);
const itemController = new ItemController(itemService);

export default itemController;
