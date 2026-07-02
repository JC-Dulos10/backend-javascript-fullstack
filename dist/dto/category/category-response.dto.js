"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryResponseDto = void 0;
class CategoryResponseDto {
    id;
    name;
    description;
    createdAt;
    updatedAt;
    constructor(id, name, description, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(category) {
        return new CategoryResponseDto(category.id, category.name, category.description, category.createdAt, category.updatedAt);
    }
}
exports.CategoryResponseDto = CategoryResponseDto;
