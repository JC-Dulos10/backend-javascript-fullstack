"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRepository = void 0;
const base_repository_1 = require("./base.repository");
// Inventory persistence logic is isolated here for easier maintenance.
class ItemRepository extends base_repository_1.BaseRepository {
    /**
     * List items with optional search, pagination, and related entities.
     */
    async findMany(params) {
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
    async count(where) {
        return this.getDb().item.count({ where });
    }
    /**
     * Find a single item by its ID.
     */
    async findById(id) {
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
    async findBySku(sku) {
        return this.getDb().item.findUnique({
            where: { sku },
        });
    }
    /**
     * Create an item record.
     */
    async create(data) {
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
    async update(id, data) {
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
    async findByCategoryId(categoryId) {
        return this.getDb().item.findMany({
            where: {
                categoryId,
            },
        });
    }
}
exports.ItemRepository = ItemRepository;
