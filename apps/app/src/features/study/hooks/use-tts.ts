import { useCallback, useEffect, useRef, useState } from "react";

const LANGUAGE_TO_BCP47: Record<string, string> = {
  English: "en-US",
  French: "fr-FR",
  Spanish: "es-ES",
  German: "de-DE",
  Italian: "it-IT",
  Portuguese: "pt-PT",
  Japanese: "ja-JP",
  Chinese: "zh-CN",
  Korean: "ko-KR",
  Russian: "ru-RU",
  Arabic: "ar-SA",
  Dutch: "nl-NL",
  Swedish: "sv-SE",
  Norwegian: "nb-NO",
  Danish: "da-DK",
  Finnish: "fi-FI",
  Polish: "pl-PL",
  Turkish: "tr-TR",
  Hindi: "hi-IN",
  Thai: "th-TH",
  Vietnamese: "vi-VN",
  Greek: "el-GR",
  Czech: "cs-CZ",
  Romanian: "ro-RO",
  Hungarian: "hu-HU",
  Ukrainian: "uk-UA",
  Hebrew: "he-IL",
  Indonesian: "id-ID",
  Malay: "ms-MY",
};

interface UseTtsReturn {
  speak: (text: string, languageName: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

export function useTts(): UseTtsReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, languageName: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_TO_BCP47[languageName] || "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
