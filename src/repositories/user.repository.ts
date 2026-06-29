import prisma from "../config/prisma";
import { RegisterDto } from "../dto/auth/register.dto";

export class UserRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: RegisterDto) {
    return prisma.user.create({
      data,
    });
  }
}