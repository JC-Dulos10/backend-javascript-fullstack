import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}