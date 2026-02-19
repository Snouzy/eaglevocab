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
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useTranslate } from "../hooks/use-translate";
import { useCreateCard } from "../hooks/use-create-card";
import { useLanguages } from "../hooks/use-languages";
import { useDecks } from "@/features/decks/hooks/use-decks";
import { useSettings } from "@/features/settings/hooks/use-settings";

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
  const [includeTranslation, setIncludeTranslation] = useState(true);
  const [includePronunciation, setIncludePronunciation] = useState(true);
  const [includeDefinition, setIncludeDefinition] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const translateMutation = useTranslate();
  const createCardMutation = useCreateCard();
  const { data: languagesData } = useLanguages();
  const { data: decksData } = useDecks();
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

  useEffect(() => {
    if (settingsData?.data?.nativeLanguageId && !targetLanguageId) {
      setValue("targetLanguageId", settingsData.data.nativeLanguageId);
    }
  }, [settingsData, targetLanguageId, setValue]);

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
    try {
      await createCardMutation.mutateAsync(data);
      toast.success("Card created successfully");
      setTranslationResult(null);
    } catch (error) {
      toast.error("Failed to create card");
      console.error(error);
    }
  }

  const decks = decksData?.data?.decks || [];

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              placeholder="Enter word to translate"
              {...register("word")}
              className="mt-1"
            />
            {errors.word && (
              <p className="text-sm text-destructive mt-1">
                {errors.word.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setOptionsOpen(!optionsOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  optionsOpen && "rotate-180"
                )}
              />
              Translation Options
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200",
                optionsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeTranslation" className="font-normal">
                      Translation
                    </Label>
                    <Switch
                      id="includeTranslation"
                      checked={includeTranslation}
                      onCheckedChange={setIncludeTranslation}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includePronunciation" className="font-normal">
                      Pronunciation
                    </Label>
                    <Switch
                      id="includePronunciation"
                      checked={includePronunciation}
                      onCheckedChange={setIncludePronunciation}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeDefinition" className="font-normal">
                      Definition
                    </Label>
                    <Switch
                      id="includeDefinition"
                      checked={includeDefinition}
                      onCheckedChange={setIncludeDefinition}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeExamples" className="font-normal">
                      Examples
                    </Label>
                    <Switch
                      id="includeExamples"
                      checked={includeExamples}
                      onCheckedChange={setIncludeExamples}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <AnimatePresence mode="wait">
            {isTranslating && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
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
                {includeTranslation && translationResult.translation && (
                  <div>
                    <Label htmlFor="translation">Translation</Label>
                    <Input
                      id="translation"
                      placeholder="Translation"
                      {...register("translation")}
                      className="mt-1"
                    />
                  </div>
                )}
                {includePronunciation && translationResult.pronunciation && (
                  <div>
                    <Label htmlFor="pronunciation">Pronunciation</Label>
                    <Input
                      id="pronunciation"
                      placeholder="Pronunciation"
                      {...register("pronunciation")}
                      className="mt-1"
                    />
                  </div>
                )}
                {includeDefinition && translationResult.definition && (
                  <div>
                    <Label htmlFor="definition">Definition</Label>
                    <Input
                      id="definition"
                      placeholder="Definition"
                      {...register("definition")}
                      className="mt-1"
                    />
                  </div>
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
                          transition={{ delay: i * 0.08 }}
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

          {decks.length > 0 && (
            <div>
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
            </div>
          )}

          <Button
            type="submit"
            variant="success"
            disabled={createCardMutation.isPending}
            className="w-full"
          >
            {createCardMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Card"
            )}
          </Button>
        </form>
  );
}
