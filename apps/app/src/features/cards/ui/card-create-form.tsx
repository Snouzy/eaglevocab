import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCardSchema, type CreateCardInput } from "@eagle-vocab/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Loader2, Check, ArrowRight, Languages, Volume2 } from "lucide-react";
import { useTts } from "@/features/study/hooks/use-tts";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { cn } from "@/shared/lib/utils";
import { useSearchParams } from "react-router";
import { useTranslate } from "../hooks/use-translate";
import { useCreateCard } from "../hooks/use-create-card";
import { useLanguages } from "../hooks/use-languages";
import { useSuggest } from "../hooks/use-suggest";
import { useDecks } from "@/features/decks/hooks/use-decks";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useBooks, useBookDetail } from "@/features/books/hooks/use-books";

interface MeaningResult {
  translation: string;
  partOfSpeech: string;
  definition: string;
  examples: Array<{ sentence: string; translation: string }> | null;
}

interface TranslationResult {
  pronunciation: string | null;
  meanings: MeaningResult[];
}

export function CardCreateForm() {
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { speak, isSpeaking } = useTts();
  const [justSaved, setJustSaved] = useState(false);
  const [suggestEnabled, setSuggestEnabled] = useState(true);

  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("bookId");
  const { data: bookDetailData } = useBookDetail(bookId || "");

  const translateMutation = useTranslate();
  const createCardMutation = useCreateCard();
  const { data: languagesData } = useLanguages();
  const { data: decksData } = useDecks();
  const { data: booksData } = useBooks();
  const { data: settingsData } = useSettings();

  const languages = languagesData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema),
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const word = watch("word");
  const sourceLanguageId = watch("sourceLanguageId");
  const targetLanguageId = watch("targetLanguageId");
  const selectedBookId = watch("bookId");

  const [debouncedWord, setDebouncedWord] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedWord(word || ""), 500);
    return () => clearTimeout(timeout);
  }, [word]);

  const sourceLang = languages.find((l: any) => l.id === sourceLanguageId);
  const bothLangsSet = !!sourceLanguageId && !!targetLanguageId;
  const decks = decksData?.data?.decks || [];

  const { suggestions, isLoading: isSuggesting } = useSuggest(
    suggestEnabled ? debouncedWord : "",
    sourceLang?.code
  );

  useEffect(() => {
    if (bookId) {
      setValue("bookId", bookId);
    }
  }, [bookId, setValue]);

  useEffect(() => {
    if (bookDetailData?.data?.languageId && !sourceLanguageId) {
      setValue("sourceLanguageId", bookDetailData.data.languageId);
    }
  }, [bookDetailData, sourceLanguageId, setValue]);

  useEffect(() => {
    if (settingsData?.data?.nativeLanguageId && !targetLanguageId) {
      setValue("targetLanguageId", settingsData.data.nativeLanguageId);
    }
  }, [settingsData, targetLanguageId, setValue]);

  useEffect(() => {
    const saved = localStorage.getItem("sourceLanguageId");
    if (saved && !sourceLanguageId) {
      setValue("sourceLanguageId", saved);
    }
  }, [sourceLanguageId, setValue]);

  useEffect(() => {
    if (sourceLanguageId) {
      localStorage.setItem("sourceLanguageId", sourceLanguageId);
    }
  }, [sourceLanguageId]);

  useEffect(() => {
    const saved = localStorage.getItem("targetLanguageId");
    if (saved && !targetLanguageId) {
      setValue("targetLanguageId", saved);
    }
  }, [targetLanguageId, setValue]);

  useEffect(() => {
    if (targetLanguageId) {
      localStorage.setItem("targetLanguageId", targetLanguageId);
    }
  }, [targetLanguageId]);

  const selectedDeckId = watch("deckId");

  useEffect(() => {
    const saved = localStorage.getItem("deckId");
    if (saved && !selectedDeckId && decks.some((d: any) => d.id === saved)) {
      setValue("deckId", saved);
    }
  }, [selectedDeckId, decks, setValue]);

  useEffect(() => {
    if (selectedDeckId) {
      localStorage.setItem("deckId", selectedDeckId);
    }
  }, [selectedDeckId]);

  async function handleTranslate() {
    setIsTranslating(true);
    try {
      const result = await translateMutation.mutateAsync({
        word,
        sourceLanguageId,
        targetLanguageId,
        options: {
          includeTranslation: true,
          includePronunciation: true,
          includeDefinition: true,
          includeExamples: true,
        },
      });

      if (result.data) {
        const data = result.data;
        setTranslationResult(data);
        setValue("pronunciation", data.pronunciation || "");
        if (data.meanings?.length) {
          const first = data.meanings[0]!;
          setValue("translation", first.translation);
          setValue("definition", first.definition);
          if (first.examples) setValue("examples", first.examples);
          setValue("meanings", data.meanings);
        }
        toast.success("Translation completed");
      }
    } catch (error) {
      toast.error("Failed to translate");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  }

  async function onSubmit(data: CreateCardInput) {
    const effectiveBookId = selectedBookId || bookId;
    try {
      await createCardMutation.mutateAsync({
        ...data,
        ...(effectiveBookId && { bookId: effectiveBookId }),
      });
      setJustSaved(true);
      toast.success("Card created successfully");
      setTranslationResult(null);

      const currentSource = sourceLanguageId;
      const currentTarget = targetLanguageId;
      reset();
      setValue("sourceLanguageId", currentSource);
      setValue("targetLanguageId", currentTarget);
      if (bookId) setValue("bookId", bookId);
      if (selectedDeckId) setValue("deckId", selectedDeckId);

      setTimeout(() => setJustSaved(false), 1500);
    } catch (error) {
      toast.error("Failed to create card");
      console.error(error);
    }
  }

  const books = booksData?.data?.books || [];
  const hasOrganizeOptions = decks.length > 0 || (books.length > 0 && !bookId);

  const hasMeanings = translationResult && translationResult.meanings.length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Language bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Combobox
            id="sourceLanguage"
            aria-label="Source language"
            options={languages.map((l: any) => ({ value: l.id, label: l.name, icon: l.flag }))}
            value={sourceLanguageId}
            onValueChange={(value) => setValue("sourceLanguageId", value)}
            placeholder="Source..."
            searchPlaceholder="Search language..."
            className="h-10 text-sm"
          />
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />

        <div className="flex-1">
          <Combobox
            id="targetLanguage"
            aria-label="Target language"
            options={languages.map((l: any) => ({ value: l.id, label: l.name, icon: l.flag }))}
            value={targetLanguageId}
            onValueChange={(value) => setValue("targetLanguageId", value)}
            placeholder="Target..."
            searchPlaceholder="Search language..."
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Word input */}
      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="word">
            Word <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="suggestToggle"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Suggestions
            </Label>
            <Switch
              id="suggestToggle"
              checked={suggestEnabled}
              onCheckedChange={(value) => setSuggestEnabled(value)}
              aria-label="Toggle word suggestions"
            />
            <HelpTooltip
              title="Suggestions"
              content="When you type without accents or special characters, we suggest the correct spelling."
            />
          </div>
        </div>

        <Input
          id="word"
          placeholder="Type a word..."
          autoFocus
          autoComplete="off"
          aria-required="true"
          aria-invalid={!!errors.word}
          aria-describedby={errors.word ? "word-error" : undefined}
          {...register("word")}
          className="mt-1.5 text-lg h-14"
        />

        <div
          className={cn(
            "grid transition-all duration-200",
            errors.word ? "grid-rows-[1fr] mt-1.5" : "grid-rows-[0fr]"
          )}
        >
          <p
            id="word-error"
            role="alert"
            className="overflow-hidden text-sm text-destructive"
          >
            {errors.word?.message}
          </p>
        </div>

        <div className="min-h-[2.5rem] mt-2">
          {suggestEnabled && isSuggesting && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Looking for suggestions...
            </span>
          )}
          {suggestEnabled && !isSuggesting && suggestions.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">Did you mean?</p>
              <div className="flex flex-wrap gap-2" role="listbox" aria-label="Word suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="option"
                    aria-selected={word === s}
                    onClick={() => setValue("word", s)}
                    className="min-h-[44px] min-w-[44px] px-4 py-2 text-base bg-muted-foreground/20 text-foreground rounded-full hover:bg-muted-foreground/30 active:scale-95 transition-all duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Translate */}
      <Button
        type="button"
        onClick={handleTranslate}
        disabled={isTranslating || !word?.trim() || !bothLangsSet}
        aria-label={isTranslating ? "Translating word" : "Translate word"}
        className="w-full"
      >
        {isTranslating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Translating...
          </>
        ) : (
          <>Translate{word?.trim() ? ` "${word.trim()}"` : ""}</>
        )}
      </Button>

      {/* Results zone */}
      <div
        className={cn(
          "rounded-xl border-2 transition-colors duration-200",
          translationResult
            ? "border-border bg-card"
            : isTranslating
              ? "border-border bg-card"
              : "border-dashed border-muted-foreground/25 bg-transparent"
        )}
      >
        {!translationResult && !isTranslating && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Languages className="h-10 w-10 text-muted-foreground/40 mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Enter a word above and tap Translate to see results
            </p>
          </div>
        )}

        {isTranslating && (
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{word}</p>
              <p className="text-sm text-muted-foreground mt-1">Translating...</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-3/4 rounded-md" />
            </div>
          </div>
        )}

        {hasMeanings && !isTranslating && (
          <div className="p-5 space-y-4 animate-in fade-in duration-200">
            {translationResult.pronunciation && (
              <div>
                <Label htmlFor="pronunciation">Pronunciation</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="pronunciation"
                    placeholder="Pronunciation"
                    {...register("pronunciation")}
                    className="bg-background pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const lang = languages.find((l: any) => l.id === sourceLanguageId);
                      if (lang && word) speak(word, lang.name);
                    }}
                    disabled={isSpeaking}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                    aria-label="Listen to pronunciation"
                  >
                    {isSpeaking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div>
              <Label className="mb-2 block">
                {translationResult.meanings.length > 1
                  ? `${translationResult.meanings.length} meanings found`
                  : "Meaning"}
              </Label>
              <div className="space-y-3">
                {translationResult.meanings.map((meaning, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-background p-4 space-y-3"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold">{meaning.translation}</span>
                      {meaning.partOfSpeech && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {meaning.partOfSpeech}
                        </span>
                      )}
                    </div>
                    {meaning.definition && (
                      <p className="text-sm text-muted-foreground">{meaning.definition}</p>
                    )}
                    {meaning.examples && meaning.examples.length > 0 && (
                      <div className="space-y-1.5">
                        {meaning.examples.map((ex, i) => (
                          <div key={i} className="p-2.5 bg-muted rounded-lg text-sm">
                            <p className="leading-relaxed">{ex.sentence}</p>
                            <p className="text-muted-foreground leading-relaxed mt-0.5">
                              {ex.translation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Organize */}
      {hasOrganizeOptions && (
        <div>
          <Separator className="my-1" />
          <p className="text-sm font-medium text-muted-foreground mb-3 mt-4">
            Add to collection (optional)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {decks.length > 0 && (
              <div>
                <Label htmlFor="deck">Deck</Label>
                <Select onValueChange={(value) => setValue("deckId", value)}>
                  <SelectTrigger id="deck" className="mt-1.5" aria-label="Select a deck">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {decks.map((deck: any) => (
                      <SelectItem key={deck.id} value={deck.id}>
                        {deck.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {books.length > 0 && !bookId && (
              <div>
                <Label htmlFor="book">Book</Label>
                <Select onValueChange={(value) => setValue("bookId", value)}>
                  <SelectTrigger id="book" className="mt-1.5" aria-label="Select a book">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book: any) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.language?.flag} {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save bar */}
      <div className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-0 left-0 right-0 z-40 p-4 bg-background/80 backdrop-blur-sm border-t lg:relative lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
        <Button
          type="submit"
          variant={justSaved ? "outline" : "success"}
          disabled={createCardMutation.isPending || justSaved}
          aria-label={
            createCardMutation.isPending
              ? "Saving card"
              : justSaved
                ? "Card saved"
                : "Save card"
          }
          className={cn(
            "w-full h-12 transition-colors duration-200",
            justSaved && "border-success text-success"
          )}
        >
          {createCardMutation.isPending ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Saving...
            </span>
          ) : justSaved ? (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
              Saved!
            </span>
          ) : (
            "Save Card"
          )}
        </Button>
      </div>
    </form>
  );
}
