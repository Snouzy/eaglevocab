import { Router, Request, Response, NextFunction } from "express";
import {
  createCardSchema,
  updateCardSchema,
  reviewCardSchema,
  createDeckSchema,
  updateDeckSchema,
  addCardToDeckSchema,
  createBookSchema,
  updateBookSchema,
  translateRequestSchema,
  updateSettingsSchema,
} from "@eagle-vocab/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import * as cardController from "../controllers/card.controller";
import * as deckController from "../controllers/deck.controller";
import * as bookController from "../controllers/book.controller";
import * as languageController from "../controllers/language.controller";
import * as translationController from "../controllers/translation.controller";
import * as settingsController from "../controllers/settings.controller";

const router: Router = Router();

router.get("/languages", languageController.listLanguages);

router.post(
  "/translate",
  authMiddleware,
  validate(translateRequestSchema),
  translationController.translate
);

router.get("/cards", authMiddleware, cardController.listCards);
router.get("/cards/:id", authMiddleware, cardController.getCard);
router.post(
  "/cards",
  authMiddleware,
  validate(createCardSchema),
  cardController.createCard
);
router.patch(
  "/cards/:id",
  authMiddleware,
  validate(updateCardSchema),
  cardController.updateCard
);
router.delete("/cards/:id", authMiddleware, cardController.deleteCard);
router.post(
  "/cards/:id/review",
  authMiddleware,
  validate(reviewCardSchema),
  cardController.reviewCard
);

router.get("/decks", authMiddleware, deckController.listDecks);
router.get("/decks/:id", authMiddleware, deckController.getDeck);
router.post(
  "/decks",
  authMiddleware,
  validate(createDeckSchema),
  deckController.createDeck
);
router.patch(
  "/decks/:id",
  authMiddleware,
  validate(updateDeckSchema),
  deckController.updateDeck
);
router.delete("/decks/:id", authMiddleware, deckController.deleteDeck);
router.post(
  "/decks/:id/cards",
  authMiddleware,
  validate(addCardToDeckSchema),
  deckController.addCardToDeck
);
router.delete(
  "/decks/:id/cards/:cardId",
  authMiddleware,
  deckController.removeCardFromDeck
);
router.get("/decks/:id/study-cards", authMiddleware, deckController.getStudyCards);

router.get("/books", authMiddleware, bookController.listBooks);
router.get("/books/:id", authMiddleware, bookController.getBook);
router.post(
  "/books",
  authMiddleware,
  validate(createBookSchema),
  bookController.createBook
);
router.patch(
  "/books/:id",
  authMiddleware,
  validate(updateBookSchema),
  bookController.updateBook
);
router.delete("/books/:id", authMiddleware, bookController.deleteBook);
router.delete("/books/:id/cards/:cardId", authMiddleware, bookController.removeCardFromBook);

router.get("/settings", authMiddleware, settingsController.getSettings);
router.patch(
  "/settings",
  authMiddleware,
  validate(updateSettingsSchema),
  settingsController.updateSettings
);

export default router;
