import { z } from "zod";

export const readwiseImportSchema = z.object({
  readwiseBookId: z.number(),
  bookId: z.string().optional(),
  createBook: z
    .object({
      title: z.string().min(1).max(300),
      author: z.string().nullable().optional(),
      languageId: z.string().min(1),
    })
    .optional(),
  sourceLanguageId: z.string().min(1),
  targetLanguageId: z.string().min(1),
});

export type ReadwiseImportInput = z.infer<typeof readwiseImportSchema>;
