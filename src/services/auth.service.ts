import { Role } from "@prisma/client";

import { RegisterDto } from "../dto/auth/register.dto";
import { UserRepository } from "../repositories/user.repository";
import { PasswordUtil } from "../utils/password";
import { ConflictError } from "../errors/ConflictError";

export class AuthService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async register(registerDto: RegisterDto) {

        const existingUser =
            await this.userRepository.findByUsername(registerDto.username);

        if (existingUser) {
            throw new ConflictError("Username already exists.");
        }

        const hashedPassword =
            await PasswordUtil.hash(registerDto.password);

        const user = await this.userRepository.create({
            username: registerDto.username,
            password: hashedPassword,
            role: Role.USER,
        });

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}