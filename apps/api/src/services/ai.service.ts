import { OpenAI } from "openai";
import { env } from "../env";
import { logger } from "../helpers/logger";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export interface MeaningContent {
  translation: string;
  partOfSpeech: string;
  definition: string;
  examples: Array<{ sentence: string; translation: string }> | null;
}

export interface TranslationContent {
  word: string;
  pronunciation: string | null;
  meanings: MeaningContent[];
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

  const examplesField = includeExamples
    ? ',\n      "examples": [{"sentence": "example in ' + sourceLanguageName + '", "translation": "translation in ' + targetLanguageName + '"}]'
    : "";

  const prompt = `You are a translation assistant. Translate the word "${word}" from ${sourceLanguageName} to ${targetLanguageName}.

If this word has MULTIPLE distinct meanings (different translations, different parts of speech, or different contexts), list ALL of them. For example, "sole" in English has 3 meanings: shoe sole, the fish, and "only/unique".

Return JSON with this exact structure:
{
  "word": "${word}",
  "pronunciation": "[phonetic transcription]",
  "meanings": [
    {
      "translation": "translation in ${targetLanguageName}",
      "partOfSpeech": "noun/verb/adjective/adverb/etc",
      "definition": "clear definition in ${targetLanguageName}"${examplesField}
    }
  ]
}

Rules:
- "pronunciation" MUST be a string with an easy-to-read phonetic transcription of "${word}" in ${sourceLanguageName}, written so a ${targetLanguageName} speaker can read it naturally. Use simple syllables separated by hyphens, enclosed in brackets. Include accent marks on stressed vowels (é, è, ê, ô, ü). Example: Romanian "săgeată" for a French speaker → "[seuh-djà-teuh]". English "try" for a French speaker → "[traï]". NEVER use IPA symbols. NEVER return a boolean.
- Each meaning must have a DIFFERENT translation. Do not repeat the same translation.
- ${includeDefinition ? `"definition" must be in ${targetLanguageName}` : '"definition": null'}
- ${includeExamples ? `Each meaning must have "examples": 2 sentences using the word WITH THAT SPECIFIC MEANING in ${sourceLanguageName}, each with its translation in ${targetLanguageName}` : ""}
- If the word has only one meaning, return an array with one element.
- Maximum 4 meanings.`;

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
      max_tokens: 1000,
    });

    const message = response.choices[0]?.message;
    if (!message || !message.content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = JSON.parse(message.content);

    const meanings: MeaningContent[] = (parsed.meanings || []).map((m: any) => ({
      translation: m.translation || "",
      partOfSpeech: m.partOfSpeech || "",
      definition: m.definition || "",
      examples: m.examples || null,
    }));

    return {
      word,
      pronunciation: typeof parsed.pronunciation === "string" ? parsed.pronunciation : null,
      meanings: meanings.length > 0 ? meanings : [{
        translation: parsed.translation || "",
        partOfSpeech: "",
        definition: parsed.definition || "",
        examples: parsed.examples || null,
      }],
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
