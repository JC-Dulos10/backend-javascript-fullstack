import { BaseRepository } from "./base.repository";
import { CreateUserDto } from "../dto/auth/create-user.dto";
import { PrismaTransaction } from "../database/prisma.types";
import prisma from "../config/prisma";

// User-specific database operations live in this repository.
export class UserRepository extends BaseRepository {
  /**
   * Find a user by their unique username.
   */
  async findByUsername(username: string, tx?: PrismaTransaction) {
    return this.getDb(tx).user.findUnique({
      where: {
        username,
      },
    });
  }

  /**
   * Find a user by their database identifier.
   */
  async findById(id: number, tx?: PrismaTransaction) {
    return this.getDb(tx).user.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Create a new user record.
   */
  async create(data: CreateUserDto, tx?: PrismaTransaction) {
    return this.getDb(tx).user.create({
      data,
    });
  }

  async findMany(params: { skip: number; take: number }) {
    return this.getDb().user.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true, role: true },
    });
  }

  async count() {
    return this.getDb().user.count();
  }

  async hasRelatedItems(userId: number) {
    const itemCount = await this.getDb().item.count({
      where: {
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
    });

    return itemCount > 0;
  }

  async delete(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.auditLog.deleteMany({ where: { userId: id } });
      return tx.user.delete({ where: { id } });
    });
  }
}
