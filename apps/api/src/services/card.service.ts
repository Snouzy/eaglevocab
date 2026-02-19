import { CreateCardInput, UpdateCardInput, ReviewCardInput } from "@eagle-vocab/types";
import { cardRepository } from "../repositories/card.repository";
import { deckRepository } from "../repositories/deck.repository";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../helpers/logger";
import { calculateNextReview } from "./srs.service";

export const getCards = async (
  userId: string,
  options: { skip?: number; take?: number; deckId?: string } = {}
) => {
  try {
    const [cards, total] = await Promise.all([
      cardRepository.findByUserId(userId, options),
      cardRepository.countByUserId(userId, options.deckId),
    ]);

    return {
      cards,
      pagination: {
        total,
        skip: options.skip || 0,
        take: options.take || 20,
      },
    };
  } catch (error) {
    logger.error("Get cards error", error);
    throw error;
  }
};

export const getCardById = async (userId: string, cardId: string) => {
  try {
    const card = await cardRepository.findById(cardId);

    if (!card) {
      throw new AppError("CARD_NOT_FOUND", "Card not found", 404);
    }

    if (card.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to access this card",
        403
      );
    }

    return card;
  } catch (error) {
    logger.error("Get card by id error", error);
    throw error;
  }
};

export const createCard = async (
  userId: string,
  input: CreateCardInput
) => {
  try {
    const card = await cardRepository.create(input, userId);
    return card;
  } catch (error) {
    logger.error("Create card error", error);
    throw error;
  }
};

export const updateCard = async (
  userId: string,
  cardId: string,
  input: UpdateCardInput
) => {
  try {
    const card = await cardRepository.findById(cardId);

    if (!card) {
      throw new AppError("CARD_NOT_FOUND", "Card not found", 404);
    }

    if (card.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to update this card",
        403
      );
    }

    const { deckId, ...updateData } = input;
    const updatedCard = await cardRepository.update(cardId, updateData);

    return updatedCard;
  } catch (error) {
    logger.error("Update card error", error);
    throw error;
  }
};

export const deleteCard = async (userId: string, cardId: string) => {
  try {
    const card = await cardRepository.findById(cardId);

    if (!card) {
      throw new AppError("CARD_NOT_FOUND", "Card not found", 404);
    }

    if (card.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to delete this card",
        403
      );
    }

    await cardRepository.delete(cardId);
  } catch (error) {
    logger.error("Delete card error", error);
    throw error;
  }
};

export const reviewCard = async (
  userId: string,
  cardId: string,
  input: ReviewCardInput
) => {
  try {
    const card = await cardRepository.findById(cardId);

    if (!card) {
      throw new AppError("CARD_NOT_FOUND", "Card not found", 404);
    }

    if (card.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to review this card",
        403
      );
    }

    const srsResult = calculateNextReview(
      {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
      },
      input.quality
    );

    const updatedCard = await cardRepository.updateSrsFields(cardId, {
      ...srsResult,
      lastReviewedAt: new Date(),
    });

    return {
      cardId: updatedCard.id,
      easeFactor: updatedCard.easeFactor,
      interval: updatedCard.interval,
      repetitions: updatedCard.repetitions,
      nextReviewAt: updatedCard.nextReviewAt,
      lastReviewedAt: updatedCard.lastReviewedAt,
    };
  } catch (error) {
    logger.error("Review card error", error);
    throw error;
  }
};
