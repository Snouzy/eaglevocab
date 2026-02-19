import { Request, Response, NextFunction } from "express";
import * as languageService from "../services/language.service";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const listLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const languages = await languageService.getAllLanguages();
    sendSuccess(res, languages);
  } catch (error) {
    next(error);
  }
};

export const getLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const language = await languageService.getLanguageById(id);
    if (!language) {
      sendError(res, "LANGUAGE_NOT_FOUND", "Language not found", 404);
      return;
    }

    sendSuccess(res, language);
  } catch (error) {
    next(error);
  }
};
