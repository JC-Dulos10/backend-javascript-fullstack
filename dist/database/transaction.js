"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class TransactionService {
    static async execute(callback) {
        return prisma_1.default.$transaction(async (tx) => {
            return callback(tx);
        });
    }
}
exports.TransactionService = TransactionService;
