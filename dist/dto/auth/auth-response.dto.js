"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
class AuthResponseDto {
    accessToken;
    user;
    constructor(accessToken, user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}
exports.AuthResponseDto = AuthResponseDto;
