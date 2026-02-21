import { z } from "zod";

export const suggestRequestSchema = z.object({
  word: z.string().min(1),
  languageCode: z.string().min(2),
});

export type SuggestRequest = z.infer<typeof suggestRequestSchema>;
export type SuggestResponse = { suggestions: string[] };
