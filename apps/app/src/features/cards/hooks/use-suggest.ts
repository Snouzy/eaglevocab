import { useState, useEffect, useRef } from "react";
import { suggest } from "../lib/card.api";

export function useSuggest(word: string, languageCode: string | undefined) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!word || word.length < 2 || !languageCode) {
      setSuggestions([]);
      return;
    }

    const hasDiacritics = /[àâăîșțéèêëïüöçáíóúñžšđćčğışöü]/i.test(word);
    if (hasDiacritics) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      try {
        const result = await suggest({ word, languageCode });
        if (!controller.signal.aborted) {
          const unique = [...new Set(result.data?.suggestions || [])];
          setSuggestions(unique);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      abortRef.current?.abort();
    };
  }, [word, languageCode]);

  return { suggestions, isLoading };
}
