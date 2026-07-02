"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordUtil {
    static SALT_ROUNDS = 10;
    static async hash(password) {
        return bcrypt_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async compare(password, hashedPassword) {
        return bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.PasswordUtil = PasswordUtil;
