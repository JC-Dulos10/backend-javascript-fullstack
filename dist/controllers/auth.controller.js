"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const register_dto_1 = require("../dto/auth/register.dto");
const login_dto_1 = require("../dto/auth/login.dto");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Handle user registration.
     */
    register = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required.",
                });
            }
            const dto = new register_dto_1.RegisterDto(req.body.username, req.body.password, req.body.role);
            const user = await this.authService.register(dto, authenticatedUser.userId);
            return res.status(201).json({
                success: true,
                message: "User registered successfully.",
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Handle user login and issue a JWT access token.
     */
    login = async (req, res, next) => {
        try {
            const dto = new login_dto_1.LoginDto(req.body.username, req.body.password);
            const result = await this.authService.login(dto);
            return res.status(200).json({
                success: true,
                message: "Login successful.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Return the authenticated user's profile information.
     */
    me = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required.",
                });
            }
            const user = await this.authService.getProfile(authenticatedUser.userId);
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Respond successfully to a logout request.
     * In JWT-based systems the client is responsible for deleting the token.
     */
    logout = async (_req, res, next) => {
        try {
            return res.status(200).json({
                success: true,
                message: "Logged out successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
