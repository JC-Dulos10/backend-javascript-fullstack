import { Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";

// Category persistence logic is grouped in this repository.
export class CategoryRepository extends BaseRepository {
  /**
   * List categories.
   */
  async findMany() {
    return this.getDb().category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find a category by its ID, optionally including related items.
   */
  async findById(id: number) {
    return this.getDb().category.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  /**
   * Find a category by its unique name.
   */
  async findByName(name: string) {
    return this.getDb().category.findUnique({
      where: { name },
    });
  }

  /**
   * Create a category record.
   */
  async create(data: Prisma.CategoryCreateInput) {
    return this.getDb().category.create({ data });
  }

  /**
   * Update a category record.
   */
  async update(id: number, data: Prisma.CategoryUpdateInput) {
    return this.getDb().category.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a category record.
   */
  async delete(id: number) {
    return this.getDb().category.delete({
      where: { id },
    });
  }
}
