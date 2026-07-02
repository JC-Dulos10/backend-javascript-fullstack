import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

// Catch application errors and return a consistent JSON response to the client.
export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
  });
}