"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    async findByUsername(username, tx) {
        return this.getDb(tx).user.findUnique({
            where: {
                username,
            },
        });
    }
    async create(data, tx) {
        return this.getDb(tx).user.create({
            data,
        });
    }
}
exports.UserRepository = UserRepository;
