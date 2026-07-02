"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const create_user_dto_1 = require("../dto/auth/create-user.dto");
const user_response_dto_1 = require("../dto/auth/user-response.dto");
const ConflictError_1 = require("../errors/ConflictError");
const password_1 = require("../security/password");
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(dto) {
        const existingUser = await this.userRepository.findByUsername(dto.username);
        if (existingUser) {
            throw new ConflictError_1.ConflictError("Username already exists.");
        }
        const hashedPassword = await password_1.PasswordUtil.hash(dto.password);
        const newUser = new create_user_dto_1.CreateUserDto(dto.username, hashedPassword, client_1.Role.USER);
        const user = await this.userRepository.create(newUser);
        return user_response_dto_1.UserResponseDto.fromEntity(user);
    }
}
exports.AuthService = AuthService;
