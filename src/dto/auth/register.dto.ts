import { Role } from "@prisma/client";

export class RegisterDto {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly role: Role
  ) {}
}
