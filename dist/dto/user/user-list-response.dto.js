"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserListResponseDto = void 0;
class UserListResponseDto {
    username;
    role;
    constructor(username, role) {
        this.username = username;
        this.role = role;
    }
    static fromEntity(user) {
        return new UserListResponseDto(user.username, user.role);
    }
}
exports.UserListResponseDto = UserListResponseDto;
