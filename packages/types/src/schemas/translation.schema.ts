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

const meaningSchema = z.object({
  translation: z.string(),
  partOfSpeech: z.string(),
  definition: z.string(),
  examples: z
    .array(
      z.object({
        sentence: z.string(),
        translation: z.string(),
      })
    )
    .nullable(),
});

export type Meaning = z.infer<typeof meaningSchema>;

export const translationResponseSchema = z.object({
  word: z.string(),
  pronunciation: z.string().nullable(),
  meanings: z.array(meaningSchema),
});

export type TranslationResponse = z.infer<typeof translationResponseSchema>;
