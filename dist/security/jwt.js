"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const auth_constant_1 = require("./auth.constant");
// Small helper class for issuing and verifying JWTs used by the auth middleware.
class JwtUtil {
    /**
     * Create a signed access token for an authenticated user.
     */
    static sign(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, {
            expiresIn: auth_constant_1.AuthConstants.ACCESS_TOKEN_EXPIRES_IN,
        });
    }
    /**
     * Decode and validate a bearer token sent by the client.
     */
    static verify(token) {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (typeof decoded === "string" || !decoded.userId || !decoded.username || !decoded.role) {
            throw new Error("Invalid token payload.");
        }
        return decoded;
    }
}
exports.JwtUtil = JwtUtil;
