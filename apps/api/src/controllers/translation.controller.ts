import { Request, Response, NextFunction } from "express";
import { TranslateRequest } from "@eagle-vocab/types";
import * as translationService from "../services/translation.service";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const translate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = req.body as TranslateRequest;

    const result = await translationService.translateRequest(input);
    sendSuccess(res, result, "Translation successful");
  } catch (error) {
    next(error);
  }
};
