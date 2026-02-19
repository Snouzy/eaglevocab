import { Request, Response, NextFunction } from "express";
import { sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Error:", error);

  if (error instanceof AppError) {
    sendError(res, error.code, error.message, error.statusCode, error.details);
  } else if (error instanceof Error) {
    sendError(res, "INTERNAL_ERROR", error.message, 500);
  } else {
    sendError(res, "INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
};
