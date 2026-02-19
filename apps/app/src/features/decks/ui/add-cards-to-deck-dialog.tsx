import { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useCards } from "@/features/cards/hooks/use-cards";
import { useAddCardToDeck } from "../hooks/use-decks";

interface AddCardsToDeckDialogProps {
  deckId: string;
  existingCardIds: string[];
}

export function AddCardsToDeckDialog({
  deckId,
  existingCardIds,
}: AddCardsToDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(
    new Set()
  );
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: allCardsData, isLoading } = useCards();
  const addCardMutation = useAddCardToDeck(deckId);

  const allCards = allCardsData?.data?.cards || [];

  const availableCards = useMemo(() => {
    const existingSet = new Set(existingCardIds);
    return allCards.filter((card: any) => !existingSet.has(card.id));
  }, [allCards, existingCardIds]);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return availableCards;
    const q = search.toLowerCase();
    return availableCards.filter(
      (card: any) =>
        card.word?.toLowerCase().includes(q) ||
        card.translation?.toLowerCase().includes(q)
    );
  }, [availableCards, search]);

  function toggleCard(cardId: string) {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }

  async function handleAdd() {
    if (selectedCardIds.size === 0) return;

    setIsAdding(true);
    try {
      for (const cardId of selectedCardIds) {
        await addCardMutation.mutateAsync(cardId);
      }
      toast.success(
        `${selectedCardIds.size} card${selectedCardIds.size > 1 ? "s" : ""} added`
      );
      setSelectedCardIds(new Set());
      setSearch("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add cards");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setSelectedCardIds(new Set());
      setSearch("");
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Cards
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Add Cards to Deck</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Select cards from your collection to add to this deck
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 max-h-[400px] space-y-1">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : filteredCards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {availableCards.length === 0
                ? "All your cards are already in this deck"
                : "No cards match your search"}
            </p>
          ) : (
            filteredCards.map((card: any) => (
              <label
                key={card.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedCardIds.has(card.id)}
                  onCheckedChange={() => toggleCard(card.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{card.word}</p>
                  {card.translation && (
                    <p className="text-sm text-muted-foreground truncate">
                      {card.translation}
                    </p>
                  )}
                </div>
              </label>
            ))
          )}
        </div>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedCardIds.size === 0 || isAdding}
          >
            {isAdding
              ? "Adding..."
              : `Add ${selectedCardIds.size || ""} Card${selectedCardIds.size !== 1 ? "s" : ""}`}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
