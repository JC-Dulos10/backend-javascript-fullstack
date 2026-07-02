import { AuditAction } from "@prisma/client";

import { CreateCategoryDto } from "../dto/category/create-category.dto";
import { UpdateCategoryDto } from "../dto/category/update-category.dto";
import { CategoryResponseDto } from "../dto/category/category-response.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { AuditRepository } from "../repositories/audit.repository";
import { CategoryRepository } from "../repositories/category.repository";

// Category rules are centralized here so the controller does not need to know about persistence details.
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly auditRepository: AuditRepository
  ) {}

  /**
   * Return all categories.
   */
  async listCategories() {
    const categories = await this.categoryRepository.findMany();
    return categories.map((category) => CategoryResponseDto.fromEntity(category));
  }

  /**
   * Return one category by its ID.
   */
  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    return CategoryResponseDto.fromEntity(category);
  }

  /**
   * Create a new category.
   */
  async createCategory(dto: CreateCategoryDto, userId: number) {
    const existingCategory = await this.categoryRepository.findByName(dto.name);

    if (existingCategory) {
      throw new ConflictError("Category name already exists.");
    }

    const category = await this.categoryRepository.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    await this.auditRepository.create({
      action: AuditAction.CREATE_ITEM,
      tableName: "Category",
      recordId: category.id,
      details: { createdBy: userId },
      user: { connect: { id: userId } },
    });

    return CategoryResponseDto.fromEntity(category);
  }

  /**
   * Update an existing category.
   */
  async updateCategory(id: number, dto: UpdateCategoryDto, userId: number) {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundError("Category not found.");
    }

    if (dto.name && dto.name !== existingCategory.name) {
      const duplicate = await this.categoryRepository.findByName(dto.name);

      if (duplicate) {
        throw new ConflictError("Category name already exists.");
      }
    }

    const category = await this.categoryRepository.update(id, {
      name: dto.name,
      description: dto.description,
    });

    await this.auditRepository.create({
      action: AuditAction.UPDATE_ITEM,
      tableName: "Category",
      recordId: category.id,
      details: { updatedBy: userId },
      user: { connect: { id: userId } },
    });

    return CategoryResponseDto.fromEntity(category);
  }

  /**
   * Delete a category, preventing deletion if items still reference it.
   */
  async deleteCategory(id: number, userId: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    if (category.items.length > 0) {
      throw new BadRequestError("Cannot delete a category that still has items.");
    }

    await this.categoryRepository.delete(id);

    await this.auditRepository.create({
      action: AuditAction.DELETE_ITEM,
      tableName: "Category",
      recordId: id,
      details: { deletedBy: userId },
      user: { connect: { id: userId } },
    });

    return { success: true, message: "Category deleted successfully." };
  }
}
