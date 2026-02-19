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
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Loader2, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useSearchParams } from "react-router";
import { useTranslate } from "../hooks/use-translate";
import { useCreateCard } from "../hooks/use-create-card";
import { useLanguages } from "../hooks/use-languages";
import { useDecks } from "@/features/decks/hooks/use-decks";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useBooks, useBookDetail } from "@/features/books/hooks/use-books";

interface TranslationResult {
  translation: string | null;
  pronunciation: string | null;
  definition: string | null;
  examples: Array<{ sentence: string; translation: string }> | null;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function CardCreateForm() {
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [includeTranslation, setIncludeTranslation] = useState(true);
  const [includePronunciation, setIncludePronunciation] = useState(true);
  const [includeDefinition, setIncludeDefinition] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

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
          includeTranslation,
          includePronunciation,
          includeDefinition,
          includeExamples,
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

  const resultFields: { key: string; label: string; field: "translation" | "pronunciation" | "definition"; show: boolean; value: string | null }[] = [
    { key: "translation", label: "Translation", field: "translation", show: includeTranslation, value: translationResult?.translation ?? null },
    { key: "pronunciation", label: "Pronunciation", field: "pronunciation", show: includePronunciation, value: translationResult?.pronunciation ?? null },
    { key: "definition", label: "Definition", field: "definition", show: includeDefinition, value: translationResult?.definition ?? null },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Language selectors */}
      <motion.div variants={sectionVariants} className="grid grid-cols-2 gap-4">
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
      </motion.div>

      {/* Word input */}
      <motion.div variants={sectionVariants}>
        <Label htmlFor="word">Word</Label>
        <Input
          id="word"
          placeholder="Enter word to translate"
          {...register("word")}
          className="mt-1"
        />
        <AnimatePresence>
          {errors.word && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-destructive mt-1 overflow-hidden"
            >
              {errors.word.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Collapsible options */}
      <motion.div variants={sectionVariants}>
        <button
          type="button"
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.span
            animate={{ rotate: optionsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
          Translation Options
        </button>
        <AnimatePresence initial={false}>
          {optionsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-3">
                {[
                  { id: "includeTranslation", label: "Translation", checked: includeTranslation, onChange: setIncludeTranslation },
                  { id: "includePronunciation", label: "Pronunciation", checked: includePronunciation, onChange: setIncludePronunciation },
                  { id: "includeDefinition", label: "Definition", checked: includeDefinition, onChange: setIncludeDefinition },
                  { id: "includeExamples", label: "Examples", checked: includeExamples, onChange: setIncludeExamples },
                ].map((opt, i) => (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={opt.id} className="font-normal">
                      {opt.label}
                    </Label>
                    <Switch
                      id={opt.id}
                      checked={opt.checked}
                      onCheckedChange={opt.onChange}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Translate button */}
      <motion.div variants={sectionVariants}>
        <Button
          type="button"
          variant="outline"
          onClick={handleTranslate}
          disabled={isTranslating}
          className="w-full"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </motion.div>

      {/* Translation results */}
      <AnimatePresence mode="wait">
        {isTranslating && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border bg-card p-4 space-y-4"
          >
            <div className="text-center py-2">
              <motion.p
                className="text-2xl font-bold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {word}
              </motion.p>
            </div>
            <div className="space-y-3">
              {[
                { show: includeTranslation, label: "Translation", width: "w-3/4" },
                { show: includePronunciation, label: "Pronunciation", width: "w-1/2" },
                { show: includeDefinition, label: "Definition", width: "w-full" },
                { show: includeExamples, label: "Examples", width: "w-5/6" },
              ].filter(s => s.show).map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="space-y-1"
                >
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className={cn("h-4 rounded-md bg-muted overflow-hidden", s.width)}>
                    <motion.div
                      className="h-full w-1/2 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent"
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {translationResult && !isTranslating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 p-3 bg-muted rounded"
          >
            {resultFields.map((rf, i) =>
              rf.show && rf.value ? (
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

            {includeExamples && translationResult.examples && translationResult.examples.length > 0 && (
              <div>
                <Label>Examples</Label>
                <div className="mt-1 space-y-2">
                  {translationResult.examples.map((ex, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.24 + i * 0.08 }}
                      className="p-2 bg-background border rounded text-sm"
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

      {/* Deck selector */}
      <AnimatePresence>
        {decks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="deck">Add to Deck (Optional)</Label>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book selector */}
      <AnimatePresence>
        {books.length > 0 && !bookId && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <Label htmlFor="book">Add to Book (Optional)</Label>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <motion.div variants={sectionVariants}>
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
      </motion.div>
    </motion.form>
  );
}
