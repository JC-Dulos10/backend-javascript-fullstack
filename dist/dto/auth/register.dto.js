"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
class RegisterDto {
    username;
    password;
    role;
    constructor(username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
exports.RegisterDto = RegisterDto;
