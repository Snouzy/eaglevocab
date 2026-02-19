import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../helpers/api-response";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        }));
        sendError(res, "VALIDATION_ERROR", "Validation failed", 400, details);
      } else {
        sendError(res, "VALIDATION_ERROR", "Validation failed", 400);
      }
    }
  };
};
