import { Request, Response, NextFunction } from "express";
import { CreateCardInput, UpdateCardInput } from "@eagle-vocab/types";
import * as cardService from "../services/card.service";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const listCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const take = req.query.take ? parseInt(req.query.take as string) : 20;
    const deckId = req.query.deckId as string | undefined;

    const result = await cardService.getCards(userId, { skip, take, deckId });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const card = await cardService.getCardById(userId, id);
    sendSuccess(res, card);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const input = req.body as CreateCardInput;

    const card = await cardService.createCard(userId, input);
    sendSuccess(res, card, "Card created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const input = req.body as UpdateCardInput;

    const card = await cardService.updateCard(userId, id, input);
    sendSuccess(res, card, "Card updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    await cardService.deleteCard(userId, id);
    sendSuccess(res, {}, "Card deleted successfully");
  } catch (error) {
    next(error);
  }
};
