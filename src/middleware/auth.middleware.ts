import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "../security/auth.types";
import { JwtUtil } from "../security/jwt";

/**
 * Protect routes by requiring a valid bearer token.
 * When the token is valid, the decoded user payload is attached to the request.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    const token = authorizationHeader.replace("Bearer ", "").trim();
    const payload = JwtUtil.verify(token);

    // Attach the authenticated user to the request for downstream handlers.
    (req as Request & { user?: JwtPayload }).user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
