"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
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
}
exports.UserRepository = UserRepository;
