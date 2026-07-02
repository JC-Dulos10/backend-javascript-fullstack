"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
const client_1 = require("@prisma/client");
const item_response_dto_1 = require("../dto/item/item-response.dto");
const BadRequestError_1 = require("../errors/BadRequestError");
const NotFoundError_1 = require("../errors/NotFoundError");
const ConflictError_1 = require("../errors/ConflictError");
// Business rules for items live here, including validation, soft-delete behavior, and audit logging.
class ItemService {
    itemRepository;
    categoryRepository;
    auditRepository;
    constructor(itemRepository, categoryRepository, auditRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.auditRepository = auditRepository;
    }
    /**
     * Return a paginated list of items, optionally filtered by a search term.
     */
    async listItems(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.max(1, Math.min(100, params.limit ?? 10));
        const skip = (page - 1) * limit;
        const where = params.search
            ? {
                OR: [
                    { name: { contains: params.search, mode: "insensitive" } },
                    { sku: { contains: params.search, mode: "insensitive" } },
                    { description: { contains: params.search, mode: "insensitive" } },
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
            data: items.map((item) => item_response_dto_1.ItemResponseDto.fromEntity(item)),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    /**
     * Load one item by its ID.
     */
    async getItemById(id) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new NotFoundError_1.NotFoundError("Item not found.");
        }
        return item_response_dto_1.ItemResponseDto.fromEntity(item);
    }
    /**
     * Create a new inventory item.
     */
    async createItem(dto, userId) {
        const existingItem = await this.itemRepository.findBySku(dto.sku);
        if (existingItem) {
            throw new ConflictError_1.ConflictError("SKU already exists.");
        }
        const category = await this.categoryRepository.findById(dto.categoryId);
        if (!category) {
            throw new NotFoundError_1.NotFoundError("Category not found.");
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
            action: client_1.AuditAction.CREATE_ITEM,
            tableName: "Item",
            recordId: item.id,
            details: { createdBy: userId },
            user: { connect: { id: userId } },
        });
        return item_response_dto_1.ItemResponseDto.fromEntity(item);
    }
    /**
     * Update an existing item.
     */
    async updateItem(id, dto, userId) {
        const existingItem = await this.itemRepository.findById(id);
        if (!existingItem) {
            throw new NotFoundError_1.NotFoundError("Item not found.");
        }
        if (dto.sku && dto.sku !== existingItem.sku) {
            const duplicate = await this.itemRepository.findBySku(dto.sku);
            if (duplicate) {
                throw new ConflictError_1.ConflictError("SKU already exists.");
            }
        }
        if (dto.categoryId) {
            const category = await this.categoryRepository.findById(dto.categoryId);
            if (!category) {
                throw new NotFoundError_1.NotFoundError("Category not found.");
            }
        }
        const updateData = {};
        if (dto.sku)
            updateData.sku = dto.sku;
        if (dto.name)
            updateData.name = dto.name;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.quantity !== undefined)
            updateData.quantity = dto.quantity;
        if (dto.receivedAt)
            updateData.receivedAt = this.parseDate(dto.receivedAt, "receivedAt");
        if (dto.categoryId)
            updateData.category = { connect: { id: dto.categoryId } };
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (dto.isActive === false)
            updateData.inactiveAt = new Date();
        if (dto.isActive === true)
            updateData.inactiveAt = null;
        updateData.updatedBy = { connect: { id: userId } };
        const item = await this.itemRepository.update(id, updateData);
        await this.auditRepository.create({
            action: client_1.AuditAction.UPDATE_ITEM,
            tableName: "Item",
            recordId: item.id,
            details: { updatedBy: userId },
            user: { connect: { id: userId } },
        });
        return item_response_dto_1.ItemResponseDto.fromEntity(item);
    }
    /**
     * Soft delete an item by marking it inactive.
     */
    async deleteItem(id, userId) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new NotFoundError_1.NotFoundError("Item not found.");
        }
        const updatedItem = await this.itemRepository.update(id, {
            isActive: false,
            inactiveAt: new Date(),
            updatedBy: { connect: { id: userId } },
        });
        await this.auditRepository.create({
            action: client_1.AuditAction.DELETE_ITEM,
            tableName: "Item",
            recordId: updatedItem.id,
            details: { deletedBy: userId },
            user: { connect: { id: userId } },
        });
        return item_response_dto_1.ItemResponseDto.fromEntity(updatedItem);
    }
    /**
     * Restore a previously soft-deleted item.
     */
    async restoreItem(id, userId) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new NotFoundError_1.NotFoundError("Item not found.");
        }
        const restoredItem = await this.itemRepository.update(id, {
            isActive: true,
            inactiveAt: null,
            updatedBy: { connect: { id: userId } },
        });
        await this.auditRepository.create({
            action: client_1.AuditAction.RESTORE_ITEM,
            tableName: "Item",
            recordId: restoredItem.id,
            details: { restoredBy: userId },
            user: { connect: { id: userId } },
        });
        return item_response_dto_1.ItemResponseDto.fromEntity(restoredItem);
    }
    parseDate(value, fieldName) {
        if (!value) {
            return new Date();
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            throw new BadRequestError_1.BadRequestError(`${fieldName} must be a valid date.`);
        }
        return parsed;
    }
}
exports.ItemService = ItemService;
