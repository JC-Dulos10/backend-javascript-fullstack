"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
/**
 * Restrict a route to a list of allowed roles.
 */
function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        const authenticatedUser = req.user;
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
