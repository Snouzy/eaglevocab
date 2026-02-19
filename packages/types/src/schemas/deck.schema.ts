import { z } from "zod";

export const createDeckSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  bookId: z.string().nullable().optional(),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;

export const updateDeckSchema = createDeckSchema.partial();

export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export const addCardToDeckSchema = z.object({
  cardId: z.string().min(1),
  position: z.number().int().min(0).optional(),
});

export type AddCardToDeckInput = z.infer<typeof addCardToDeckSchema>;
