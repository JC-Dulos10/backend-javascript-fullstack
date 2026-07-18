"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    list = async (req, res, next) => {
        try {
            const result = await this.userService.listUsers({
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
            });
            return res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({ success: false, message: "Authentication token is required." });
            }
            const result = await this.userService.deleteUser(Number(req.params.id), authenticatedUser.userId);
            return res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
