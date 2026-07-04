import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

import { ValidationTarget } from "../types/validation";

export function validate(
  schema: ZodType,
  target: ValidationTarget = "body"
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    // Validate the incoming payload before it reaches the controller/service layer.
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: result.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // Express' `req.query` can be implemented as a getter-only property depending on the runtime/types.
    // Avoid direct assignment; instead merge validated data into it.
    if (target === 'query') {
      Object.assign(req.query as any, result.data);
    } else {
      (req as any)[target] = result.data;
    }

    next();
  };
}