import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/auth/register.dto";

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

          const dto = new RegisterDto(
              req.body.username,
              req.body.password
          );

          const user =
              await this.authService.register(dto);

          return res.status(201).json({
              success: true,
              message: "User registered successfully.",
              data: user
          });

      } catch (error) {
          next(error);
      }

  }
}