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
// This layer is independent of HTTP and can be reused by other interfaces (CLI, gRPC, etc.)
class AuthService {
    userRepository;
    auditRepository;
    constructor(userRepository, auditRepository) {
        this.userRepository = userRepository;
        this.auditRepository = auditRepository;
    }
    /**
     * Register a new user account and hash the supplied password.
     *
     * Business logic:
     * 1. Check if username already exists in database
     * 2. If it does, throw a ConflictError (HTTP 409)
     * 3. Hash the plaintext password using bcrypt
     * 4. Create a new user record with the administrator-selected role
     * 5. Return user data (without password hash) to caller
     *
     * @param dto - Contains username, plaintext password, and role
     * @returns User data without password hash
     * @throws ConflictError if username already exists
     */
    async register(dto, createdByUserId) {
        const existingUser = await this.userRepository.findByUsername(dto.username);
        if (existingUser) {
            throw new ConflictError_1.ConflictError("Username already exists.");
        }
        // Hash password before storing in database
        const hashedPassword = await password_1.PasswordUtil.hash(dto.password);
        const newUser = new create_user_dto_1.CreateUserDto(dto.username, hashedPassword, dto.role);
        const user = await this.userRepository.create(newUser);
        await this.auditRepository.create({
            action: client_1.AuditAction.REGISTER,
            tableName: "User",
            recordId: user.id,
            details: { username: user.username, role: user.role },
            user: { connect: { id: createdByUserId } },
        });
        return user_response_dto_1.UserResponseDto.fromEntity(user);
    }
    /**
     * Validate credentials and return a signed access token.
     *
     * Business logic:
     * 1. Find user by username
     * 2. Compare supplied password with hashed password in database
     * 3. If credentials invalid, throw UnauthorizedError
     * 4. If valid, create a JWT token containing user identity and role
     * 5. Return both user data and token to client
     *
     * @param dto - Contains username and plaintext password
     * @returns Object with user data and JWT token
     * @throws UnauthorizedError if user not found or password incorrect
     */
    async login(dto) {
        const existingUser = await this.userRepository.findByUsername(dto.username);
        if (!existingUser) {
            throw new UnauthorizedError_1.UnauthorizedError("Invalid username or password.");
        }
        // Use bcrypt to compare plaintext password against stored hash
        const isPasswordValid = await password_1.PasswordUtil.compare(dto.password, existingUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError_1.UnauthorizedError("Invalid username or password.");
        }
        // Create JWT token with user claims
        // Token is used by client in Authorization header for subsequent requests
        const token = jwt_1.JwtUtil.sign({
            userId: existingUser.id,
            username: existingUser.username,
            role: existingUser.role,
        });
        await this.auditRepository.create({
            action: client_1.AuditAction.LOGIN,
            tableName: "User",
            recordId: existingUser.id,
            details: { username: existingUser.username },
            user: { connect: { id: existingUser.id } },
        });
        return {
            user: user_response_dto_1.UserResponseDto.fromEntity(existingUser),
            token,
        };
    }
    /**
     * Return the profile of a currently authenticated user.
     *
     * This endpoint requires a valid JWT token (verified in middleware).
     * The middleware extracts userId from the token and passes it here.
     *
     * @param userId - User ID extracted from JWT token
     * @returns User profile data (without password hash)
     * @throws NotFoundError if user no longer exists
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
