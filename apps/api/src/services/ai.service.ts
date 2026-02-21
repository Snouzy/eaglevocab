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
  tr: "Turkish",
  nl: "Dutch",
  pl: "Polish",
  ro: "Romanian",
  sv: "Swedish",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
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
      `pronunciation: an easy-to-read phonetic transcription of the original word "${word}" in ${sourceLanguageName}, written so that a ${targetLanguageName} speaker can read it naturally. Use simple syllables separated by hyphens, enclosed in brackets. Include accent marks on vowels to indicate stress and correct pronunciation (e.g. é, è, ê, ô, ü, etc.). Example for Romanian "misterele" for a French speaker: [mi-sté-ré-lè]. Example for Romanian "săgeată" for a French speaker: [seuh-djà-teuh]. NEVER use IPA symbols like ʃ, ɛ, ŋ, θ, etc.`
    );
  }
  if (includeDefinition) {
    requestFields.push(`definition: a clear definition in ${targetLanguageName}`);
  }
  if (includeExamples) {
    requestFields.push(
      `examples: an array of 2-3 example sentences using the word in ${sourceLanguageName} (sentence field), each with its translation in ${targetLanguageName} (translation field)`
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

export const suggestDiacritics = async (
  word: string,
  languageCode: string
): Promise<string[]> => {
  const languageName = languageNames[languageCode] || languageCode;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Add correct diacritics/accents to this ${languageName} word: "${word}". Return JSON: {"suggestions": ["word1"]}. Max 3 suggestions. If already correct or no diacritics needed, return {"suggestions": []}.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 30,
    });

    const message = response.choices[0]?.message;
    if (!message?.content) return [];

    const parsed = JSON.parse(message.content);
    return (parsed.suggestions || []).filter((s: string) => s.toLowerCase() !== word.toLowerCase());
  } catch (error) {
    logger.error("Suggest diacritics error", error);
    return [];
  }
};
