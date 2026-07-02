import { BaseRepository } from "./base.repository";
import { CreateUserDto } from "../dto/auth/create-user.dto";
import { PrismaTransaction } from "../database/prisma.types";

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
}