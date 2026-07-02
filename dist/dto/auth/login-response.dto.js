"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDto = void 0;
class LoginResponseDto {
    accessToken;
    user;
    constructor(accessToken, user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}
exports.LoginResponseDto = LoginResponseDto;
