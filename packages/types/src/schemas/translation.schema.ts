import { z } from "zod";

export const translateRequestSchema = z.object({
  word: z.string().min(1).max(200),
  sourceLanguageId: z.string().min(1),
  targetLanguageId: z.string().min(1),
  options: z
    .object({
      includeTranslation: z.boolean().default(true),
      includePronunciation: z.boolean().default(true),
      includeDefinition: z.boolean().default(true),
      includeExamples: z.boolean().default(true),
    })
    .default({}),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;

export const translationResponseSchema = z.object({
  word: z.string(),
  translation: z.string().nullable(),
  pronunciation: z.string().nullable(),
  definition: z.string().nullable(),
  examples: z
    .array(
      z.object({
        sentence: z.string(),
        translation: z.string(),
      })
    )
    .nullable(),
});

export type TranslationResponse = z.infer<typeof translationResponseSchema>;
