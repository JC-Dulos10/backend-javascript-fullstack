"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const category_response_dto_1 = require("../dto/category/category-response.dto");
const BadRequestError_1 = require("../errors/BadRequestError");
const ConflictError_1 = require("../errors/ConflictError");
const NotFoundError_1 = require("../errors/NotFoundError");
// Category rules are centralized here so the controller does not need to know about persistence details.
class CategoryService {
    categoryRepository;
    auditRepository;
    constructor(categoryRepository, auditRepository) {
        this.categoryRepository = categoryRepository;
        this.auditRepository = auditRepository;
    }
    /**
     * Return all categories.
     */
    async listCategories() {
        const categories = await this.categoryRepository.findMany();
        return categories.map((category) => category_response_dto_1.CategoryResponseDto.fromEntity(category));
    }
    /**
     * Return one category by its ID.
     */
    async getCategoryById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new NotFoundError_1.NotFoundError("Category not found.");
        }
        return category_response_dto_1.CategoryResponseDto.fromEntity(category);
    }
    /**
     * Create a new category.
     */
    async createCategory(dto, userId) {
        const existingCategory = await this.categoryRepository.findByName(dto.name);
        if (existingCategory) {
            throw new ConflictError_1.ConflictError("Category name already exists.");
        }
        const category = await this.categoryRepository.create({
            name: dto.name,
            description: dto.description ?? null,
        });
        await this.auditRepository.create({
            action: client_1.AuditAction.CREATE_ITEM,
            tableName: "Category",
            recordId: category.id,
            details: { createdBy: userId },
            user: { connect: { id: userId } },
        });
        return category_response_dto_1.CategoryResponseDto.fromEntity(category);
    }
    /**
     * Update an existing category.
     */
    async updateCategory(id, dto, userId) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new NotFoundError_1.NotFoundError("Category not found.");
        }
        if (dto.name && dto.name !== existingCategory.name) {
            const duplicate = await this.categoryRepository.findByName(dto.name);
            if (duplicate) {
                throw new ConflictError_1.ConflictError("Category name already exists.");
            }
        }
        const category = await this.categoryRepository.update(id, {
            name: dto.name,
            description: dto.description,
        });
        await this.auditRepository.create({
            action: client_1.AuditAction.UPDATE_ITEM,
            tableName: "Category",
            recordId: category.id,
            details: { updatedBy: userId },
            user: { connect: { id: userId } },
        });
        return category_response_dto_1.CategoryResponseDto.fromEntity(category);
    }
    /**
     * Delete a category, preventing deletion if items still reference it.
     */
    async deleteCategory(id, userId) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new NotFoundError_1.NotFoundError("Category not found.");
        }
        if (category.items.length > 0) {
            throw new BadRequestError_1.BadRequestError("Cannot delete a category that still has items.");
        }
        await this.categoryRepository.delete(id);
        await this.auditRepository.create({
            action: client_1.AuditAction.DELETE_ITEM,
            tableName: "Category",
            recordId: id,
            details: { deletedBy: userId },
            user: { connect: { id: userId } },
        });
        return { success: true, message: "Category deleted successfully." };
    }
}
exports.CategoryService = CategoryService;
