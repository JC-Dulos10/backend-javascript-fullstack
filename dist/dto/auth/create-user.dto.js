"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
class CreateUserDto {
    username;
    password;
    role;
    constructor(username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
exports.CreateUserDto = CreateUserDto;
