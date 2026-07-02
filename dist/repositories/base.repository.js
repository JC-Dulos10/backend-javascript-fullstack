"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// Shared repository helpers keep Prisma access consistent across the app.
class BaseRepository {
    getDb(tx) {
        return tx ?? prisma_1.default;
    }
}
exports.BaseRepository = BaseRepository;
