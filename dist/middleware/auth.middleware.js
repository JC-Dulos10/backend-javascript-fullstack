"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../security/jwt");
/**
 * Protect routes by requiring a valid bearer token.
 * When the token is valid, the decoded user payload is attached to the request.
 */
function authMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required.",
            });
        }
        const token = authorizationHeader.replace("Bearer ", "").trim();
        const payload = jwt_1.JwtUtil.verify(token);
        // Attach the authenticated user to the request for downstream handlers.
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
}
