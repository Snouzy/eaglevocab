import { CreateBookInput, UpdateBookInput } from "@eagle-vocab/types";
import { bookRepository } from "../repositories/book.repository";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../helpers/logger";

export const getBooks = async (
  userId: string,
  options: { skip?: number; take?: number } = {}
) => {
  try {
    const [books, total] = await Promise.all([
      bookRepository.findByUserId(userId, options),
      bookRepository.countByUserId(userId),
    ]);

    return {
      books,
      pagination: {
        total,
        skip: options.skip || 0,
        take: options.take || 20,
      },
    };
  } catch (error) {
    logger.error("Get books error", error);
    throw error;
  }
};

export const getBookById = async (userId: string, bookId: string) => {
  try {
    const book = await bookRepository.findById(bookId);

    if (!book) {
      throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);
    }

    if (book.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to access this book",
        403
      );
    }

    return book;
  } catch (error) {
    logger.error("Get book by id error", error);
    throw error;
  }
};

export const createBook = async (
  userId: string,
  input: CreateBookInput
) => {
  try {
    const book = await bookRepository.create(input, userId);
    return book;
  } catch (error) {
    logger.error("Create book error", error);
    throw error;
  }
};

export const updateBook = async (
  userId: string,
  bookId: string,
  input: UpdateBookInput
) => {
  try {
    const book = await bookRepository.findById(bookId);

    if (!book) {
      throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);
    }

    if (book.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to update this book",
        403
      );
    }

    const updatedBook = await bookRepository.update(bookId, input);
    return updatedBook;
  } catch (error) {
    logger.error("Update book error", error);
    throw error;
  }
};

export const deleteBook = async (userId: string, bookId: string) => {
  try {
    const book = await bookRepository.findById(bookId);

    if (!book) {
      throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);
    }

    if (book.userId !== userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "You do not have permission to delete this book",
        403
      );
    }

    await bookRepository.delete(bookId);
  } catch (error) {
    logger.error("Delete book error", error);
    throw error;
  }
};
