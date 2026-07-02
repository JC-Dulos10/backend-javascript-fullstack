"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const base_repository_1 = require("./base.repository");
// Category persistence logic is grouped in this repository.
class CategoryRepository extends base_repository_1.BaseRepository {
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
    async findById(id) {
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
    async findByName(name) {
        return this.getDb().category.findUnique({
            where: { name },
        });
    }
    /**
     * Create a category record.
     */
    async create(data) {
        return this.getDb().category.create({ data });
    }
    /**
     * Update a category record.
     */
    async update(id, data) {
        return this.getDb().category.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a category record.
     */
    async delete(id) {
        return this.getDb().category.delete({
            where: { id },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
