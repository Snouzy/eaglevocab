import { TranslateRequest } from "@eagle-vocab/types";
import { translateWord } from "./ai.service";
import { languageRepository } from "../repositories/language.repository";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../helpers/logger";

export const translateRequest = async (request: TranslateRequest) => {
  try {
    const { word, sourceLanguageId, targetLanguageId, options } = request;

    const sourceLanguage = await languageRepository.findById(sourceLanguageId);
    if (!sourceLanguage) {
      throw new AppError(
        "LANGUAGE_NOT_FOUND",
        `Source language with id ${sourceLanguageId} not found`,
        404
      );
    }

    const targetLanguage = await languageRepository.findById(targetLanguageId);
    if (!targetLanguage) {
      throw new AppError(
        "LANGUAGE_NOT_FOUND",
        `Target language with id ${targetLanguageId} not found`,
        404
      );
    }

    const result = await translateWord(
      word,
      sourceLanguage.code,
      targetLanguage.code,
      options
    );

    return result;
  } catch (error) {
    logger.error("Translation service error", error);
    throw error;
  }
};
