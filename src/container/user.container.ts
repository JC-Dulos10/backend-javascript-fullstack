import { UserController } from "../controllers/user.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

const userController = new UserController(new UserService(new UserRepository()));

export default userController;
