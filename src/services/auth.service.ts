import { Role } from "@prisma/client";

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

// The service layer contains the auth business rules and keeps the controller thin.
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Register a new user account and hash the supplied password.
   */
  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByUsername(dto.username);

    if (existingUser) {
      throw new ConflictError("Username already exists.");
    }

    const hashedPassword = await PasswordUtil.hash(dto.password);

    const newUser = new CreateUserDto(dto.username, hashedPassword, Role.USER);
    const user = await this.userRepository.create(newUser);

    return UserResponseDto.fromEntity(user);
  }

  /**
   * Validate credentials and return a signed access token.
   */
  async login(dto: LoginDto): Promise<{ user: UserResponseDto; token: string }> {
    const existingUser = await this.userRepository.findByUsername(dto.username);

    if (!existingUser) {
      throw new UnauthorizedError("Invalid username or password.");
    }

    const isPasswordValid = await PasswordUtil.compare(dto.password, existingUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid username or password.");
    }

    const token = JwtUtil.sign({
      userId: existingUser.id,
      username: existingUser.username,
      role: existingUser.role,
    });

    return {
      user: UserResponseDto.fromEntity(existingUser),
      token,
    };
  }

  /**
   * Return the profile of a currently authenticated user.
   */
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return UserResponseDto.fromEntity(user);
  }
}