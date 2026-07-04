import type { Request, Response, NextFunction } from 'express';

import { roleMiddleware } from '../../middleware/role.middleware';
import { Role } from '@prisma/client';

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe('roleMiddleware', () => {
  it('returns 401 when req.user is missing', () => {
    const mw = roleMiddleware([Role.ADMIN]);

    const req = {} as Request;
    const res = mockRes();
    const next = jest.fn() as unknown as NextFunction;

    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication token is required.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user role is not allowed', () => {
    const mw = roleMiddleware([Role.ADMIN]);

    const req = { user: { role: Role.USER } } as unknown as Request & {
      user: { role: Role };
    };
    const res = mockRes();
    const next = jest.fn() as unknown as NextFunction;

    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'You do not have permission to perform this action.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when user role is allowed', () => {
    const mw = roleMiddleware([Role.ADMIN]);

    const req = { user: { role: Role.ADMIN } } as unknown as Request & {
      user: { role: Role };
    };
    const res = mockRes();
    const next = jest.fn() as unknown as NextFunction;

    mw(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

