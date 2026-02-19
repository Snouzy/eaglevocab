import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1).max(300),
  author: z.string().nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  languageId: z.string().min(1),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema.partial();

export type UpdateBookInput = z.infer<typeof updateBookSchema>;
