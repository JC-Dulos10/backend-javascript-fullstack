"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const register_dto_1 = require("../dto/auth/register.dto");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const dto = new register_dto_1.RegisterDto(req.body.username, req.body.password);
            const user = await this.authService.register(dto);
            return res.status(201).json({
                success: true,
                message: "User registered successfully.",
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
