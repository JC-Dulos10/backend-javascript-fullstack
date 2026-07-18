import { AuditAction } from "@prisma/client";

import { RegisterDto } from "../dto/auth/register.dto";
import { CreateUserDto } from "../dto/auth/create-user.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { UserResponseDto } from "../dto/auth/user-response.dto";

import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

import { PasswordUtil } from "../security/password";
import { JwtUtil } from "../security/jwt";

import { UserRepository } from "../repositories/user.repository";
import { AuditRepository } from "../repositories/audit.repository";

// The service layer contains the auth business rules and keeps the controller thin.
// This layer is independent of HTTP and can be reused by other interfaces (CLI, gRPC, etc.)
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditRepository: AuditRepository
  ) {}

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
  async register(dto: RegisterDto, createdByUserId: number): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByUsername(dto.username);

    if (existingUser) {
      throw new ConflictError("Username already exists.");
    }

    // Hash password before storing in database
    const hashedPassword = await PasswordUtil.hash(dto.password);

    const newUser = new CreateUserDto(dto.username, hashedPassword, dto.role);
    const user = await this.userRepository.create(newUser);

    await this.auditRepository.create({
      action: AuditAction.REGISTER,
      tableName: "User",
      recordId: user.id,
      details: { username: user.username, role: user.role },
      user: { connect: { id: createdByUserId } },
    });

    return UserResponseDto.fromEntity(user);
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
  async login(dto: LoginDto): Promise<{ user: UserResponseDto; token: string }> {
    const existingUser = await this.userRepository.findByUsername(dto.username);

    if (!existingUser) {
      throw new UnauthorizedError("Invalid username or password.");
    }

    // Use bcrypt to compare plaintext password against stored hash
    const isPasswordValid = await PasswordUtil.compare(dto.password, existingUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid username or password.");
    }

    // Create JWT token with user claims
    // Token is used by client in Authorization header for subsequent requests
    const token = JwtUtil.sign({
      userId: existingUser.id,
      username: existingUser.username,
      role: existingUser.role,
    });

    await this.auditRepository.create({
      action: AuditAction.LOGIN,
      tableName: "User",
      recordId: existingUser.id,
      details: { username: existingUser.username },
      user: { connect: { id: existingUser.id } },
    });

    return {
      user: UserResponseDto.fromEntity(existingUser),
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
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return UserResponseDto.fromEntity(user);
  }
}
