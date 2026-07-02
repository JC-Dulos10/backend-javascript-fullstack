import { Request, Response, NextFunction } from "express";

import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { JwtPayload } from "../security/auth.types";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handle user registration.
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = new RegisterDto(req.body.username, req.body.password);
      const user = await this.authService.register(dto);

      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle user login and issue a JWT access token.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = new LoginDto(req.body.username, req.body.password);
      const result = await this.authService.login(dto);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Return the authenticated user's profile information.
   */
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = (req as Request & { user?: JwtPayload }).user;

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
    } catch (error) {
      next(error);
    }
  };

  /**
   * Respond successfully to a logout request.
   * In JWT-based systems the client is responsible for deleting the token.
   */
  logout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}