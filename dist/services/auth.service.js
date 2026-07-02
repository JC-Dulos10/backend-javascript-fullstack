"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const create_user_dto_1 = require("../dto/auth/create-user.dto");
const user_response_dto_1 = require("../dto/auth/user-response.dto");
const ConflictError_1 = require("../errors/ConflictError");
const NotFoundError_1 = require("../errors/NotFoundError");
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
const password_1 = require("../security/password");
const jwt_1 = require("../security/jwt");
// The service layer contains the auth business rules and keeps the controller thin.
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Register a new user account and hash the supplied password.
     */
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
    /**
     * Validate credentials and return a signed access token.
     */
    async login(dto) {
        const existingUser = await this.userRepository.findByUsername(dto.username);
        if (!existingUser) {
            throw new UnauthorizedError_1.UnauthorizedError("Invalid username or password.");
        }
        const isPasswordValid = await password_1.PasswordUtil.compare(dto.password, existingUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError_1.UnauthorizedError("Invalid username or password.");
        }
        const token = jwt_1.JwtUtil.sign({
            userId: existingUser.id,
            username: existingUser.username,
            role: existingUser.role,
        });
        return {
            user: user_response_dto_1.UserResponseDto.fromEntity(existingUser),
            token,
        };
    }
    /**
     * Return the profile of a currently authenticated user.
     */
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError_1.NotFoundError("User not found.");
        }
        return user_response_dto_1.UserResponseDto.fromEntity(user);
    }
}
exports.AuthService = AuthService;
