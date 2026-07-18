"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const BadRequestError_1 = require("../errors/BadRequestError");
const NotFoundError_1 = require("../errors/NotFoundError");
const user_list_response_dto_1 = require("../dto/user/user-list-response.dto");
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async listUsers(params) {
        const page = Math.max(1, params.page);
        const limit = Math.max(1, Math.min(100, params.limit));
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userRepository.findMany({ skip, take: limit }),
            this.userRepository.count(),
        ]);
        return {
            data: users.map(user_list_response_dto_1.UserListResponseDto.fromEntity),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async deleteUser(id, requestingUserId) {
        if (id === requestingUserId) {
            throw new BadRequestError_1.BadRequestError("You cannot delete your own account.");
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError_1.NotFoundError("User not found.");
        }
        if (await this.userRepository.hasRelatedItems(id)) {
            throw new BadRequestError_1.BadRequestError("Cannot delete a user who is linked to inventory items.");
        }
        await this.userRepository.delete(id);
        return { success: true, message: "User deleted successfully." };
    }
}
exports.UserService = UserService;
