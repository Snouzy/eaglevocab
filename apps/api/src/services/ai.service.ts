import { OpenAI } from "openai";
import { env } from "../env";
import { logger } from "../helpers/logger";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export interface TranslationContent {
  word: string;
  translation: string | null;
  pronunciation: string | null;
  definition: string | null;
  examples: Array<{
    sentence: string;
    translation: string;
  }> | null;
}

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
};

export const translateWord = async (
  word: string,
  sourceLanguageCode: string,
  targetLanguageCode: string,
  options: {
    includeTranslation?: boolean;
    includePronunciation?: boolean;
    includeDefinition?: boolean;
    includeExamples?: boolean;
  } = {}
): Promise<TranslationContent> => {
  const {
    includeTranslation = true,
    includePronunciation = true,
    includeDefinition = true,
    includeExamples = true,
  } = options;

  const sourceLanguageName = languageNames[sourceLanguageCode] || sourceLanguageCode;
  const targetLanguageName = languageNames[targetLanguageCode] || targetLanguageCode;

  const requestFields: string[] = [
    `word: the original word "${word}"`,
  ];

  if (includeTranslation) {
    requestFields.push(`translation: the translation in ${targetLanguageName}`);
  }
  if (includePronunciation) {
    requestFields.push(
      `pronunciation: phonetic transcription of the word as pronounced by a speaker of ${targetLanguageName}`
    );
  }
  if (includeDefinition) {
    requestFields.push(`definition: a clear definition in ${targetLanguageName}`);
  }
  if (includeExamples) {
    requestFields.push(
      `examples: an array of 2-3 example sentences with the word in ${targetLanguageName}, each with sentence and translation fields`
    );
  }

  const prompt = `You are a translation assistant. Translate the word "${word}" from ${sourceLanguageName} to ${targetLanguageName}.

Provide the response in JSON format with the following fields:
${requestFields.map((field, i) => `${i + 1}. ${field}`).join("\n")}

For fields not requested, use null.
For examples array, if not requested or cannot be provided, use null.
Ensure the response is valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const message = response.choices[0]?.message;
    if (!message || !message.content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = JSON.parse(message.content);

    return {
      word,
      translation: parsed.translation || null,
      pronunciation: parsed.pronunciation || null,
      definition: parsed.definition || null,
      examples: parsed.examples || null,
    };
  } catch (error) {
    logger.error("Translation service error", error);
    throw error;
  }
};
