import { CreateDeckInput, UpdateDeckInput, AddCardToDeckInput } from "@eagle-vocab/types";
import { deckRepository } from "../repositories/deck.repository";
import { cardRepository } from "../repositories/card.repository";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../helpers/logger";

export const getDecks = async (
  userId: string,
  options: { skip?: number; take?: number } = {}
) => {
  try {
    const [decks, total] = await Promise.all([
      deckRepository.findByUserId(userId, options),
      deckRepository.countByUserId(userId),
    ]);

    return {
      decks,
      pagination: {
        total,
        skip: options.skip || 0,
        take: options.take || 20,
      },
    };
  } catch (error) {
    logger.error("Get decks error", error);
    throw error;
  }
};

export const getDeckById = async (userId: string, deckId: string) => {
  try {
    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new AppError("DECK_NOT_FOUND", "Deck not found", 404);
    }

    if (deck.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to access this deck",
        403
      );
    }

    return deck;
  } catch (error) {
    logger.error("Get deck by id error", error);
    throw error;
  }
};

export const createDeck = async (
  userId: string,
  input: CreateDeckInput
) => {
  try {
    const deck = await deckRepository.create(input, userId);
    return deck;
  } catch (error) {
    logger.error("Create deck error", error);
    throw error;
  }
};

export const updateDeck = async (
  userId: string,
  deckId: string,
  input: UpdateDeckInput
) => {
  try {
    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new AppError("DECK_NOT_FOUND", "Deck not found", 404);
    }

    if (deck.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to update this deck",
        403
      );
    }

    const updatedDeck = await deckRepository.update(deckId, input);
    return updatedDeck;
  } catch (error) {
    logger.error("Update deck error", error);
    throw error;
  }
};

export const deleteDeck = async (userId: string, deckId: string) => {
  try {
    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new AppError("DECK_NOT_FOUND", "Deck not found", 404);
    }

    if (deck.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to delete this deck",
        403
      );
    }

    await deckRepository.delete(deckId);
  } catch (error) {
    logger.error("Delete deck error", error);
    throw error;
  }
};

export const addCardToDeck = async (
  userId: string,
  deckId: string,
  input: AddCardToDeckInput
) => {
  try {
    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new AppError("DECK_NOT_FOUND", "Deck not found", 404);
    }

    if (deck.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to modify this deck",
        403
      );
    }

    const card = await cardRepository.findById(input.cardId);

    if (!card) {
      throw new AppError("CARD_NOT_FOUND", "Card not found", 404);
    }

    if (card.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to add this card",
        403
      );
    }

    await deckRepository.addCardToDeck(deckId, input.cardId, input.position);
    return await deckRepository.findById(deckId);
  } catch (error) {
    logger.error("Add card to deck error", error);
    throw error;
  }
};

export const removeCardFromDeck = async (
  userId: string,
  deckId: string,
  cardId: string
) => {
  try {
    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new AppError("DECK_NOT_FOUND", "Deck not found", 404);
    }

    if (deck.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to modify this deck",
        403
      );
    }

    await deckRepository.removeCardFromDeck(deckId, cardId);
    return await deckRepository.findById(deckId);
  } catch (error) {
    logger.error("Remove card from deck error", error);
    throw error;
  }
};
