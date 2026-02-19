import { useState, ReactNode } from "react";
import { toast } from "sonner";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useUpdateCard } from "../hooks/use-cards";

interface Example {
  sentence: string;
  translation: string;
}

interface CardEditDialogProps {
  card: {
    id: string;
    word: string;
    translation: string | null;
    pronunciation: string | null;
    definition: string | null;
    examples: Example[] | null;
  };
  deckId?: string;
  trigger?: ReactNode;
}

export function CardEditDialog({ card, deckId, trigger }: CardEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState(card.word);
  const [translation, setTranslation] = useState(card.translation || "");
  const [pronunciation, setPronunciation] = useState(card.pronunciation || "");
  const [definition, setDefinition] = useState(card.definition || "");
  const [examples, setExamples] = useState<Example[]>(card.examples || []);

  const updateCardMutation = useUpdateCard(deckId);

  function handleOpenChange(value: boolean) {
    if (value) {
      setWord(card.word);
      setTranslation(card.translation || "");
      setPronunciation(card.pronunciation || "");
      setDefinition(card.definition || "");
      setExamples(card.examples?.map((e) => ({ ...e })) || []);
    }
    setOpen(value);
  }

  function updateExample(index: number, field: keyof Example, value: string) {
    setExamples((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  }

  function addExample() {
    setExamples((prev) => [...prev, { sentence: "", translation: "" }]);
  }

  function removeExample(index: number) {
    setExamples((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!word.trim()) {
      toast.error("Word is required");
      return;
    }

    const cleanedExamples = examples.filter(
      (ex) => ex.sentence.trim() || ex.translation.trim()
    );

    try {
      await updateCardMutation.mutateAsync({
        cardId: card.id,
        data: {
          word: word.trim(),
          translation: translation.trim() || null,
          pronunciation: pronunciation.trim() || null,
          definition: definition.trim() || null,
          examples: cleanedExamples.length > 0 ? cleanedExamples : null,
        },
      });
      toast.success("Card updated");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update card");
      console.error(error);
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Edit</Button>}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Edit Card</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Update the card information</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter word"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="translation">Translation</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter translation"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pronunciation">Pronunciation</Label>
            <Input
              id="pronunciation"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder="Enter pronunciation"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="definition">Definition</Label>
            <Input
              id="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter definition"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Examples</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addExample}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {examples.length === 0 ? (
              <p className="text-sm text-muted-foreground">No examples yet</p>
            ) : (
              <div className="space-y-3">
                {examples.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 border border-border rounded-lg"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        value={ex.sentence}
                        onChange={(e) =>
                          updateExample(i, "sentence", e.target.value)
                        }
                        placeholder="Sentence"
                      />
                      <Input
                        value={ex.translation}
                        onChange={(e) =>
                          updateExample(i, "translation", e.target.value)
                        }
                        placeholder="Translation"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeExample(i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={updateCardMutation.isPending}
          >
            {updateCardMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
