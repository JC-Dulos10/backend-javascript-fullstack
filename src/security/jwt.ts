import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AuthConstants } from "./auth.constant";
import { JwtPayload } from "./auth.types";

// Small helper class for issuing and verifying JWTs used by the auth middleware.
export class JwtUtil {
  /**
   * Create a signed access token for an authenticated user.
   */
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: AuthConstants.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Decode and validate a bearer token sent by the client.
   */
  static verify(token: string): JwtPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string" || !decoded.userId || !decoded.username || !decoded.role) {
      throw new Error("Invalid token payload.");
    }

    return decoded as JwtPayload;
  }
}