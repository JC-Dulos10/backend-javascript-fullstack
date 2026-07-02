import { AuditAction } from "@prisma/client";

import { CreateItemDto } from "../dto/item/create-item.dto";
import { UpdateItemDto } from "../dto/item/update-item.dto";
import { ItemResponseDto } from "../dto/item/item-response.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";
import { AuditRepository } from "../repositories/audit.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { ItemRepository } from "../repositories/item.repository";

// Business rules for items live here, including validation, soft-delete behavior, and audit logging.
export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly auditRepository: AuditRepository
  ) {}

  /**
   * Return a paginated list of items, optionally filtered by a search term.
   */
  async listItems(params: { page: number; limit: number; search?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.max(1, Math.min(100, params.limit ?? 10));
    const skip = (page - 1) * limit;

    const where = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            { sku: { contains: params.search, mode: "insensitive" as const } },
            { description: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [items, total] = await Promise.all([
      this.itemRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.itemRepository.count(where),
    ]);

    return {
      data: items.map((item) => ItemResponseDto.fromEntity(item)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Load one item by its ID.
   */
  async getItemById(id: number) {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found.");
    }

    return ItemResponseDto.fromEntity(item);
  }

  /**
   * Create a new inventory item.
   */
  async createItem(dto: CreateItemDto, userId: number) {
    const existingItem = await this.itemRepository.findBySku(dto.sku);

    if (existingItem) {
      throw new ConflictError("SKU already exists.");
    }

    const category = await this.categoryRepository.findById(dto.categoryId);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    const receivedAt = this.parseDate(dto.receivedAt, "receivedAt");

    const item = await this.itemRepository.create({
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      quantity: dto.quantity,
      receivedAt,
      category: { connect: { id: dto.categoryId } },
      createdBy: { connect: { id: userId } },
      updatedBy: { connect: { id: userId } },
    });

    await this.auditRepository.create({
      action: AuditAction.CREATE_ITEM,
      tableName: "Item",
      recordId: item.id,
      details: { createdBy: userId },
      user: { connect: { id: userId } },
    });

    return ItemResponseDto.fromEntity(item);
  }

  /**
   * Update an existing item.
   */
  async updateItem(id: number, dto: UpdateItemDto, userId: number) {
    const existingItem = await this.itemRepository.findById(id);

    if (!existingItem) {
      throw new NotFoundError("Item not found.");
    }

    if (dto.sku && dto.sku !== existingItem.sku) {
      const duplicate = await this.itemRepository.findBySku(dto.sku);

      if (duplicate) {
        throw new ConflictError("SKU already exists.");
      }
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundError("Category not found.");
      }
    }

    const updateData: Record<string, unknown> = {};

    if (dto.sku) updateData.sku = dto.sku;
    if (dto.name) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.quantity !== undefined) updateData.quantity = dto.quantity;
    if (dto.receivedAt) updateData.receivedAt = this.parseDate(dto.receivedAt, "receivedAt");
    if (dto.categoryId) updateData.category = { connect: { id: dto.categoryId } };
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.isActive === false) updateData.inactiveAt = new Date();
    if (dto.isActive === true) updateData.inactiveAt = null;

    updateData.updatedBy = { connect: { id: userId } };

    const item = await this.itemRepository.update(id, updateData);

    await this.auditRepository.create({
      action: AuditAction.UPDATE_ITEM,
      tableName: "Item",
      recordId: item.id,
      details: { updatedBy: userId },
      user: { connect: { id: userId } },
    });

    return ItemResponseDto.fromEntity(item);
  }

  /**
   * Soft delete an item by marking it inactive.
   */
  async deleteItem(id: number, userId: number) {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found.");
    }

    const updatedItem = await this.itemRepository.update(id, {
      isActive: false,
      inactiveAt: new Date(),
      updatedBy: { connect: { id: userId } },
    });

    await this.auditRepository.create({
      action: AuditAction.DELETE_ITEM,
      tableName: "Item",
      recordId: updatedItem.id,
      details: { deletedBy: userId },
      user: { connect: { id: userId } },
    });

    return ItemResponseDto.fromEntity(updatedItem);
  }

  /**
   * Restore a previously soft-deleted item.
   */
  async restoreItem(id: number, userId: number) {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found.");
    }

    const restoredItem = await this.itemRepository.update(id, {
      isActive: true,
      inactiveAt: null,
      updatedBy: { connect: { id: userId } },
    });

    await this.auditRepository.create({
      action: AuditAction.RESTORE_ITEM,
      tableName: "Item",
      recordId: restoredItem.id,
      details: { restoredBy: userId },
      user: { connect: { id: userId } },
    });

    return ItemResponseDto.fromEntity(restoredItem);
  }

  private parseDate(value: string | undefined, fieldName: string): Date {
    if (!value) {
      return new Date();
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestError(`${fieldName} must be a valid date.`);
    }

    return parsed;
  }
}
