"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
class UserResponseDto {
    id;
    username;
    role;
    createdAt;
    constructor(id, username, role, createdAt) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.createdAt = createdAt;
    }
    static fromEntity(user) {
        return new UserResponseDto(user.id, user.username, user.role, user.createdAt);
    }
}
exports.UserResponseDto = UserResponseDto;
