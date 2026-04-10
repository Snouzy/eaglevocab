import { Request, Response, NextFunction } from "express";
import { ReadwiseImportInput } from "@eagle-vocab/types";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";
import { settingsRepository } from "../repositories/settings.repository";
import {
  fetchReadwiseBooks,
  fetchReadwiseHighlights,
} from "../services/readwise.service";
import { translateWord } from "../services/ai.service";
import { cardRepository } from "../repositories/card.repository";
import { bookRepository } from "../repositories/book.repository";
import { languageRepository } from "../repositories/language.repository";

export const listBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const settings = await settingsRepository.findByUserId(userId);

    if (!settings?.readwiseToken) {
      sendError(
        res,
        "READWISE_NOT_CONNECTED",
        "Connect Readwise in Settings first",
        400
      );
      return;
    }

    const books = await fetchReadwiseBooks(settings.readwiseToken);
    sendSuccess(res, { books });
  } catch (error) {
    next(error);
  }
};

export const listHighlights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const bookId = parseInt(req.params.bookId);

    const settings = await settingsRepository.findByUserId(userId);

    if (!settings?.readwiseToken) {
      sendError(
        res,
        "READWISE_NOT_CONNECTED",
        "Connect Readwise in Settings first",
        400
      );
      return;
    }

    const highlights = await fetchReadwiseHighlights(
      settings.readwiseToken,
      bookId
    );
    sendSuccess(res, { highlights });
  } catch (error) {
    next(error);
  }
};

export const importHighlights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const body = req.body as ReadwiseImportInput;

    const settings = await settingsRepository.findByUserId(userId);

    if (!settings?.readwiseToken) {
      sendError(
        res,
        "READWISE_NOT_CONNECTED",
        "Connect Readwise in Settings first",
        400
      );
      return;
    }

    const highlights = await fetchReadwiseHighlights(
      settings.readwiseToken,
      body.readwiseBookId
    );

    let bookId = body.bookId;
    if (!bookId && body.createBook) {
      const newBook = await bookRepository.create(body.createBook, userId);
      bookId = newBook.id;
    }

    if (!bookId) {
      sendError(res, "INVALID_INPUT", "Book ID or createBook is required", 400);
      return;
    }

    const sourceLang = await languageRepository.findById(
      body.sourceLanguageId
    );
    const targetLang = await languageRepository.findById(
      body.targetLanguageId
    );

    if (!sourceLang || !targetLang) {
      sendError(res, "INVALID_INPUT", "Invalid language IDs", 400);
      return;
    }

    let imported = 0;
    let errors = 0;
    const highlightsToImport = highlights.slice(0, 50);

    for (const highlight of highlightsToImport) {
      try {
        const translation = await translateWord(
          highlight.text,
          sourceLang.code,
          targetLang.code
        );

        if (translation && translation.meanings && translation.meanings.length > 0) {
          const meaning = translation.meanings[0];
          await cardRepository.create(
            {
              word: highlight.text,
              translation: meaning.translation,
              pronunciation: translation.pronunciation,
              definition: meaning.definition,
              examples: meaning.examples,
              meanings: translation.meanings,
              sourceLanguageId: body.sourceLanguageId,
              targetLanguageId: body.targetLanguageId,
              bookId,
            },
            userId
          );
          imported++;
        }
      } catch (err) {
        logger.error(`Failed to import highlight: ${highlight.text}`, err);
        errors++;
      }
    }

    sendSuccess(
      res,
      { imported, total: highlights.length, errors },
      "Import completed",
      201
    );
  } catch (error) {
    next(error);
  }
};
