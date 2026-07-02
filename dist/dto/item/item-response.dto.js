"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemResponseDto = void 0;
class ItemResponseDto {
    id;
    sku;
    name;
    description;
    quantity;
    receivedAt;
    isActive;
    inactiveAt;
    categoryId;
    category;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    constructor(id, sku, name, description, quantity, receivedAt, isActive, inactiveAt, categoryId, category, createdBy, updatedBy, createdAt, updatedAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.receivedAt = receivedAt;
        this.isActive = isActive;
        this.inactiveAt = inactiveAt;
        this.categoryId = categoryId;
        this.category = category;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(item) {
        return new ItemResponseDto(item.id, item.sku, item.name, item.description, item.quantity, item.receivedAt, item.isActive, item.inactiveAt, item.categoryId, item.category
            ? {
                id: item.category.id,
                name: item.category.name,
                description: item.category.description,
            }
            : null, item.createdBy
            ? {
                id: item.createdBy.id,
                username: item.createdBy.username,
            }
            : null, item.updatedBy
            ? {
                id: item.updatedBy.id,
                username: item.updatedBy.username,
            }
            : null, item.createdAt, item.updatedAt);
    }
}
exports.ItemResponseDto = ItemResponseDto;
