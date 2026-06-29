import { Request, Response } from "express";

export class AuthController {
  async register(req: Request, res: Response) {
    res.json({
      message: "Register endpoint",
    });
  }
}