"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../security/jwt");
/**
 * Middleware to protect routes by requiring a valid bearer token.
 *
 * Flow:
 * 1. Extract Authorization header from request
 * 2. Verify it starts with "Bearer "
 * 3. Extract the JWT token from the header
 * 4. Verify the token signature and expiration using JwtUtil
 * 5. If valid, attach decoded user payload to req.user
 * 6. If invalid, return 401 Unauthorized
 *
 * Downstream handlers can access the authenticated user via req.user,
 * which contains userId, username, and role.
 *
 * Usage: app.get('/api/protected', authMiddleware, controllerHandler)
 */
function authMiddleware(req, res, next) {
    try {
        // Extract the Authorization header
        const authorizationHeader = req.headers.authorization;
        // Verify format: "Bearer <token>"
        if (!authorizationHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required.",
            });
        }
        // Extract the token by removing "Bearer " prefix and trimming whitespace
        const token = authorizationHeader.replace("Bearer ", "").trim();
        // Verify token signature and get the decoded payload
        // This throws an error if the token is invalid, tampered, or expired
        const payload = jwt_1.JwtUtil.verify(token);
        // Attach the authenticated user to the request for downstream handlers.
        // This allows controllers to know which user is making the request
        req.user = payload;
        next();
    }
    catch {
        // Token verification failed (invalid signature, expired, malformed, etc.)
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
}
