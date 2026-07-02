import { Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";
import { PrismaTransaction } from "../database/prisma.types";

// Inventory persistence logic is isolated here for easier maintenance.
export class ItemRepository extends BaseRepository {
  /**
   * List items with optional search, pagination, and related entities.
   */
  async findMany(params: {
    where?: Prisma.ItemWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
    include?: Prisma.ItemInclude;
  }) {
    return this.getDb().item.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
      include: params.include,
    });
  }

  /**
   * Count items that match the supplied filters.
   */
  async count(where?: Prisma.ItemWhereInput) {
    return this.getDb().item.count({ where });
  }

  /**
   * Find a single item by its ID.
   */
  async findById(id: number) {
    return this.getDb().item.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: { select: { id: true, username: true } },
        updatedBy: { select: { id: true, username: true } },
      },
    });
  }

  /**
   * Find an item by its unique SKU.
   */
  async findBySku(sku: string) {
    return this.getDb().item.findUnique({
      where: { sku },
    });
  }

  /**
   * Create an item record.
   */
  async create(data: Prisma.ItemCreateInput) {
    return this.getDb().item.create({
      data,
      include: {
        category: true,
        createdBy: { select: { id: true, username: true } },
        updatedBy: { select: { id: true, username: true } },
      },
    });
  }

  /**
   * Update an item record.
   */
  async update(id: number, data: Prisma.ItemUpdateInput) {
    return this.getDb().item.update({
      where: { id },
      data,
      include: {
        category: true,
        createdBy: { select: { id: true, username: true } },
        updatedBy: { select: { id: true, username: true } },
      },
    });
  }

  /**
   * Find items that belong to a given category.
   */
  async findByCategoryId(categoryId: number) {
    return this.getDb().item.findMany({
      where: {
        categoryId,
      },
    });
  }
}
