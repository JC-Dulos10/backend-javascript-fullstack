import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

import { JwtPayload } from "../security/auth.types";

/**
 * Restrict a route to a list of allowed roles.
 */
export function roleMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUser = (req as Request & { user?: JwtPayload }).user;

    if (!authenticatedUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    if (!allowedRoles.includes(authenticatedUser.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
}
