import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "../security/auth.types";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.listUsers({
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 10),
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = (req as Request & { user?: JwtPayload }).user;
      if (!authenticatedUser) {
        return res.status(401).json({ success: false, message: "Authentication token is required." });
      }

      const result = await this.userService.deleteUser(Number(req.params.id), authenticatedUser.userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
