"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateItemDto = void 0;
class CreateItemDto {
    sku;
    name;
    description;
    quantity;
    receivedAt;
    categoryId;
    constructor(sku, name, description, quantity, receivedAt, categoryId) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.receivedAt = receivedAt;
        this.categoryId = categoryId;
    }
}
exports.CreateItemDto = CreateItemDto;
