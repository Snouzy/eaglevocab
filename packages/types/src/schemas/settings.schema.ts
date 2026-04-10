import { z } from "zod";

export const updateSettingsSchema = z.object({
  nativeLanguageId: z.string().min(1).optional(),
  showPronunciation: z.boolean().optional(),
  showExamples: z.boolean().optional(),
  showDefinition: z.boolean().optional(),
  readwiseToken: z.string().nullable().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
