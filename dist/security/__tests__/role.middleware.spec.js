"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_middleware_1 = require("../../middleware/role.middleware");
const client_1 = require("@prisma/client");
function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}
describe('roleMiddleware', () => {
    it('returns 401 when req.user is missing', () => {
        const mw = (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN]);
        const req = {};
        const res = mockRes();
        const next = jest.fn();
        mw(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Authentication token is required.',
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('returns 403 when user role is not allowed', () => {
        const mw = (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN]);
        const req = { user: { role: client_1.Role.USER } };
        const res = mockRes();
        const next = jest.fn();
        mw(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'You do not have permission to perform this action.',
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('calls next when user role is allowed', () => {
        const mw = (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN]);
        const req = { user: { role: client_1.Role.ADMIN } };
        const res = mockRes();
        const next = jest.fn();
        mw(req, res, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
