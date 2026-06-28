import prisma from "../config/prisma";

export class UserRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async create(data: {
    username: string;
    password: string;
    role: "ADMIN" | "USER";
  }) {
    return prisma.user.create({
      data,
    });
  }
}