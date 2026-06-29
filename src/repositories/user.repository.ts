import prisma from "../config/prisma";
import { CreateUserDto } from "../dto/auth/create-user.dto";

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

  async create(data: CreateUserDto) {
    return prisma.user.create({
        data,
    });
  }
}