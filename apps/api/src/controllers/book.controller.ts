import { Request, Response, NextFunction } from "express";
import { CreateBookInput, UpdateBookInput } from "@eagle-vocab/types";
import * as bookService from "../services/book.service";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const listBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const take = req.query.take ? parseInt(req.query.take as string) : 20;

    const result = await bookService.getBooks(userId, { skip, take });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const book = await bookService.getBookById(userId, id);
    sendSuccess(res, book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const input = req.body as CreateBookInput;

    const book = await bookService.createBook(userId, input);
    sendSuccess(res, book, "Book created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const input = req.body as UpdateBookInput;

    const book = await bookService.updateBook(userId, id, input);
    sendSuccess(res, book, "Book updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    await bookService.deleteBook(userId, id);
    sendSuccess(res, {}, "Book deleted successfully");
  } catch (error) {
    next(error);
  }
};
