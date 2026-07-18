import { Role } from "@prisma/client";

export class UserListResponseDto {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly role: Role
  ) {}

  static fromEntity(user: { id: number; username: string; role: Role }): UserListResponseDto {
    return new UserListResponseDto(user.id, user.username, user.role);
  }
}
