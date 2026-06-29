import { Role } from "@prisma/client";

import { RegisterDto } from "../dto/auth/register.dto";
import { CreateUserDto } from "../dto/auth/create-user.dto";
import { UserResponseDto } from "../dto/auth/user-response.dto";

import { ConflictError } from "../errors/ConflictError";

import { PasswordUtil } from "../utils/password";

import { UserRepository } from "../repositories/user.repository";

export class AuthService {

    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async register(dto: RegisterDto): Promise<UserResponseDto> {

        const existingUser =
            await this.userRepository.findByUsername(dto.username);

        if (existingUser) {
            throw new ConflictError("Username already exists.");
        }

        const hashedPassword =
            await PasswordUtil.hash(dto.password);

        const newUser =
            new CreateUserDto(
                dto.username,
                hashedPassword,
                Role.USER
            );

        const user =
            await this.userRepository.create(newUser);

        return UserResponseDto.fromEntity(user);

    }

}