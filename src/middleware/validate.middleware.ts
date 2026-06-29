import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        })),
      });
    }

    // Replace req.body with the validated and transformed data
    req.body = result.data;

    next();
  };
}