import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCardSchema, type CreateCardInput } from "@eagle-vocab/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Check, ChevronDown } from "lucide-react";
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

interface TranslationResult {
  translation: string | null;
  pronunciation: string | null;
  definition: string | null;
  examples: Array<{ sentence: string; translation: string }> | null;
}

export function CardCreateForm() {
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showOrganize, setShowOrganize] = useState(false);
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
    formState: { errors },
  } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema),
  });

  const word = watch("word");
  const sourceLanguageId = watch("sourceLanguageId");
  const targetLanguageId = watch("targetLanguageId");
  const selectedBookId = watch("bookId");

  const sourceLang = languages.find((l: any) => l.id === sourceLanguageId);
  const targetLang = languages.find((l: any) => l.id === targetLanguageId);
  const bothLangsSet = !!sourceLanguageId && !!targetLanguageId;

  const { suggestions, isLoading: isSuggesting } = useSuggest(
    suggestEnabled ? word : "",
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

  async function handleTranslate() {
    if (!word) {
      toast.error("Please enter a word");
      return;
    }

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
        setTranslationResult(result.data);
        setValue("translation", result.data.translation || "");
        setValue("pronunciation", result.data.pronunciation || "");
        setValue("definition", result.data.definition || "");
        if (result.data.examples) {
          setValue("examples", result.data.examples);
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
      setTimeout(() => setJustSaved(false), 1500);
    } catch (error) {
      toast.error("Failed to create card");
      console.error(error);
    }
  }

  const decks = decksData?.data?.decks || [];
  const books = booksData?.data?.books || [];
  const hasOrganizeOptions = decks.length > 0 || (books.length > 0 && !bookId);

  const resultFields: { key: string; label: string; field: "translation" | "pronunciation" | "definition"; value: string | null }[] = [
    { key: "translation", label: "Translation", field: "translation", value: translationResult?.translation ?? null },
    { key: "pronunciation", label: "Pronunciation", field: "pronunciation", value: translationResult?.pronunciation ?? null },
    { key: "definition", label: "Definition", field: "definition", value: translationResult?.definition ?? null },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Language summary — collapsed when both set */}
      {bothLangsSet && !showLanguages ? (
        <button
          type="button"
          onClick={() => setShowLanguages(true)}
          className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-lg">{sourceLang?.flag}</span>
          <span>{sourceLang?.name}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-lg">{targetLang?.flag}</span>
          <span>{targetLang?.name}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <Label htmlFor="sourceLanguage">Source Language</Label>
            <Select
              value={sourceLanguageId}
              onValueChange={(value) => setValue("sourceLanguageId", value)}
            >
              <SelectTrigger id="sourceLanguage" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang: any) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="targetLanguage">Target Language</Label>
            <Select
              value={targetLanguageId}
              onValueChange={(value) => setValue("targetLanguageId", value)}
            >
              <SelectTrigger id="targetLanguage" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang: any) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {bothLangsSet && (
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => setShowLanguages(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Hide
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Word input — hero section */}
      <div>
        <Label htmlFor="word">Word</Label>
        <Input
          id="word"
          placeholder="Type a word..."
          autoFocus
          {...register("word")}
          className="mt-1 text-lg h-14"
        />
        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            errors.word ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <p className="overflow-hidden text-sm text-destructive mt-1">
            {errors.word?.message ?? "\u00A0"}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm text-muted-foreground">
            {suggestEnabled && isSuggesting && (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Looking for suggestions...
              </span>
            )}
            {suggestEnabled && !isSuggesting && suggestions.length > 0 && (
              <span>Did you mean?</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSuggestEnabled(!suggestEnabled)}
              className={cn(
                "text-sm transition-colors",
                suggestEnabled
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {suggestEnabled ? "Disable suggestions" : "Enable suggestions"}
            </button>
            <HelpTooltip
              title="Suggestions"
              content="When you type without accents or special characters, we suggest the correct spelling. Useful when you don't have the right keyboard installed."
            />
          </div>
        </div>
        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            suggestEnabled && suggestions.length > 0
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-2 mt-1.5 pb-0.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("word", s)}
                  className="px-3 py-1.5 text-base bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Translate button — primary action */}
      <Button
        type="button"
        onClick={handleTranslate}
        disabled={isTranslating}
        className="w-full"
      >
        {isTranslating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Translating...
          </>
        ) : (
          "Translate"
        )}
      </Button>

      {/* Translation results */}
      <AnimatePresence mode="wait">
        {isTranslating && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border bg-card p-6 flex flex-col items-center gap-3"
          >
            <motion.p
              className="text-2xl font-bold"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {word}
            </motion.p>
            <p className="text-sm text-muted-foreground">Looking up translation...</p>
          </motion.div>
        )}

        {translationResult && !isTranslating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 p-4 bg-muted rounded-xl"
          >
            {resultFields.map((rf, i) =>
              rf.value ? (
                <motion.div
                  key={rf.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Label htmlFor={rf.key}>{rf.label}</Label>
                  <Input
                    id={rf.key}
                    placeholder={rf.label}
                    {...register(rf.field)}
                    className="mt-1"
                  />
                </motion.div>
              ) : null
            )}

            {translationResult.examples && translationResult.examples.length > 0 && (
              <div>
                <Label>Examples</Label>
                <div className="mt-1 space-y-2">
                  {translationResult.examples.map((ex, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.24 + i * 0.08 }}
                      className="p-3 bg-background border rounded-lg"
                    >
                      <p>{ex.sentence}</p>
                      <p className="text-muted-foreground">{ex.translation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Organize — collapsed by default */}
      {hasOrganizeOptions && (
        <div>
          <button
            type="button"
            onClick={() => setShowOrganize(!showOrganize)}
            className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            <motion.span
              animate={{ rotate: showOrganize ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
            Add to a deck or book
          </button>
          <AnimatePresence initial={false}>
            {showOrganize && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-3">
                  {decks.length > 0 && (
                    <div>
                      <Label htmlFor="deck">Deck</Label>
                      <Select onValueChange={(value) => setValue("deckId", value)}>
                        <SelectTrigger id="deck" className="mt-1">
                          <SelectValue placeholder="Select a deck..." />
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
                        <SelectTrigger id="book" className="mt-1">
                          <SelectValue placeholder="Select a book..." />
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Save button */}
      <Button
        type="submit"
        variant={justSaved ? "outline" : "success"}
        disabled={createCardMutation.isPending || justSaved}
        className={cn("w-full transition-all duration-300", justSaved && "border-success text-success")}
      >
        <AnimatePresence mode="wait">
          {createCardMutation.isPending ? (
            <motion.span
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </motion.span>
          ) : justSaved ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </motion.span>
          ) : (
            <motion.span
              key="save"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Save Card
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}
