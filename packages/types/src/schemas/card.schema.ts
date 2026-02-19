import { z } from "zod";

export const createCardSchema = z.object({
  word: z.string().min(1).max(200),
  translation: z.string().nullable().optional(),
  pronunciation: z.string().nullable().optional(),
  definition: z.string().nullable().optional(),
  examples: z
    .array(
      z.object({
        sentence: z.string(),
        translation: z.string(),
      })
    )
    .nullable()
    .optional(),
  notes: z.string().nullable().optional(),
  sourceLanguageId: z.string().min(1),
  targetLanguageId: z.string().min(1),
  deckId: z.string().optional(),
  bookId: z.string().optional(),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;

export const updateCardSchema = createCardSchema.partial();

export type UpdateCardInput = z.infer<typeof updateCardSchema>;
