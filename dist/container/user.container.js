"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const user_repository_1 = require("../repositories/user.repository");
const user_service_1 = require("../services/user.service");
const userController = new user_controller_1.UserController(new user_service_1.UserService(new user_repository_1.UserRepository()));
exports.default = userController;
