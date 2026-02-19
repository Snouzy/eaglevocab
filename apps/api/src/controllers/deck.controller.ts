import { Request, Response, NextFunction } from "express";
import { CreateDeckInput, UpdateDeckInput, AddCardToDeckInput } from "@eagle-vocab/types";
import * as deckService from "../services/deck.service";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const listDecks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const take = req.query.take ? parseInt(req.query.take as string) : 20;

    const result = await deckService.getDecks(userId, { skip, take });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getDeck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const deck = await deckService.getDeckById(userId, id);
    sendSuccess(res, deck);
  } catch (error) {
    next(error);
  }
};

export const createDeck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const input = req.body as CreateDeckInput;

    const deck = await deckService.createDeck(userId, input);
    sendSuccess(res, deck, "Deck created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateDeck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const input = req.body as UpdateDeckInput;

    const deck = await deckService.updateDeck(userId, id, input);
    sendSuccess(res, deck, "Deck updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteDeck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    await deckService.deleteDeck(userId, id);
    sendSuccess(res, {}, "Deck deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const addCardToDeck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const input = req.body as AddCardToDeckInput;

    const deck = await deckService.addCardToDeck(userId, id, input);
    sendSuccess(res, deck, "Card added to deck successfully");
  } catch (error) {
    next(error);
  }
};

export const removeCardFromDeck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const cardId = req.params.cardId as string;

    const deck = await deckService.removeCardFromDeck(userId, id, cardId);
    sendSuccess(res, deck, "Card removed from deck successfully");
  } catch (error) {
    next(error);
  }
};
