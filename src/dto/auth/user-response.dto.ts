import { Role } from "@prisma/client";

export class UserResponseDto {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly role: Role,
    public readonly createdAt: Date
  ) {}

  static fromEntity(user: {
    id: number;
    username: string;
    role: Role;
    createdAt: Date;
  }): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.username,
      user.role,
      user.createdAt
    );
  }
}