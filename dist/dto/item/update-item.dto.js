"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItemDto = void 0;
class UpdateItemDto {
    sku;
    name;
    description;
    quantity;
    receivedAt;
    categoryId;
    isActive;
    constructor(sku, name, description, quantity, receivedAt, categoryId, isActive) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.receivedAt = receivedAt;
        this.categoryId = categoryId;
        this.isActive = isActive;
    }
}
exports.UpdateItemDto = UpdateItemDto;
