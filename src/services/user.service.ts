import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { UserRepository } from "../repositories/user.repository";
import { UserListResponseDto } from "../dto/user/user-list-response.dto";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async listUsers(params: { page: number; limit: number }) {
    const page = Math.max(1, params.page);
    const limit = Math.max(1, Math.min(100, params.limit));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.findMany({ skip, take: limit }),
      this.userRepository.count(),
    ]);

    return {
      data: users.map(UserListResponseDto.fromEntity),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteUser(id: number, requestingUserId: number) {
    if (id === requestingUserId) {
      throw new BadRequestError("You cannot delete your own account.");
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (await this.userRepository.hasRelatedItems(id)) {
      throw new BadRequestError("Cannot delete a user who is linked to inventory items.");
    }

    await this.userRepository.delete(id);
    return { success: true, message: "User deleted successfully." };
  }
}
