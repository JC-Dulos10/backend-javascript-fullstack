"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
const prisma_1 = __importDefault(require("../config/prisma"));
// User-specific database operations live in this repository.
class UserRepository extends base_repository_1.BaseRepository {
    /**
     * Find a user by their unique username.
     */
    async findByUsername(username, tx) {
        return this.getDb(tx).user.findUnique({
            where: {
                username,
            },
        });
    }
    /**
     * Find a user by their database identifier.
     */
    async findById(id, tx) {
        return this.getDb(tx).user.findUnique({
            where: {
                id,
            },
        });
    }
    /**
     * Create a new user record.
     */
    async create(data, tx) {
        return this.getDb(tx).user.create({
            data,
        });
    }
    async findMany(params) {
        return this.getDb().user.findMany({
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
            select: { username: true, role: true },
        });
    }
    async count() {
        return this.getDb().user.count();
    }
    async hasRelatedItems(userId) {
        const itemCount = await this.getDb().item.count({
            where: {
                OR: [{ createdById: userId }, { updatedById: userId }],
            },
        });
        return itemCount > 0;
    }
    async delete(id) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.auditLog.deleteMany({ where: { userId: id } });
            return tx.user.delete({ where: { id } });
        });
    }
}
exports.UserRepository = UserRepository;
