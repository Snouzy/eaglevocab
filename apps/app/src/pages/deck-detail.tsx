import { Link as ReactRouterLink, useParams } from "react-router";
import { useState, useRef } from "react";
import { useCards } from "@/features/cards/hooks/use-cards";
import { useDeckDetail, useUpdateDeck, useRemoveCardFromDeck } from "@/features/decks/hooks/use-decks";
import { AddCardsToDeckDialog } from "@/features/decks/ui/add-cards-to-deck-dialog";
import { CardEditDialog } from "@/features/cards/ui/card-edit-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, GraduationCap, Pencil, X } from "lucide-react";
import { toast } from "sonner";

export function DeckDetailPage() {
  const { deckId } = useParams();
  const { data: deckData, isLoading: deckLoading } = useDeckDetail(deckId!);
  const { data: cardsData, isLoading: cardsLoading } = useCards(deckId!);
  const updateDeckMutation = useUpdateDeck(deckId!);
  const removeCardMutation = useRemoveCardFromDeck(deckId!);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const deck = deckData?.data;
  const cards = cardsData?.data?.cards || [];
  const existingCardIds = cards.map((card: any) => card.id);

  const handleNameEdit = () => {
    setEditName(deck?.name || "");
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (editName.trim() && editName !== deck?.name) {
      try {
        await updateDeckMutation.mutateAsync({
          name: editName.trim(),
        });
        toast.success("Deck name updated");
      } catch (error) {
        toast.error("Failed to update deck name");
      }
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };

  const handleDescriptionEdit = () => {
    setEditDescription(deck?.description || "");
    setIsEditingDescription(true);
  };

  const handleDescriptionSave = async () => {
    if (editDescription !== deck?.description) {
      try {
        await updateDeckMutation.mutateAsync({
          description: editDescription,
        });
        toast.success("Deck description updated");
      } catch (error) {
        toast.error("Failed to update deck description");
      }
    }
    setIsEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      handleDescriptionCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <ReactRouterLink to="/decks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </ReactRouterLink>
        <div className="flex-1 min-w-0">
          {deckLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              {isEditingName ? (
                <Input
                  ref={nameInputRef}
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleNameKeyDown}
                  className="text-2xl font-bold tracking-tight mb-1"
                />
              ) : (
                <h1
                  className="text-2xl font-bold tracking-tight cursor-pointer hover:underline hover:decoration-dashed"
                  onClick={handleNameEdit}
                >
                  {deck?.name}
                </h1>
              )}
              {isEditingDescription ? (
                <Input
                  ref={descriptionInputRef}
                  autoFocus
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  onKeyDown={handleDescriptionKeyDown}
                  className="text-muted-foreground"
                />
              ) : (
                <p
                  className="text-muted-foreground cursor-pointer hover:underline hover:decoration-dashed"
                  onClick={handleDescriptionEdit}
                >
                  {deck?.description}
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <ReactRouterLink to={`/study/${deckId}?mode=normal`}>
            <Button variant="success" disabled={cards.length === 0}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Study
            </Button>
          </ReactRouterLink>
          <ReactRouterLink to={`/study/${deckId}?mode=reverse`}>
            <Button variant="outline" className="text-success border-success hover:bg-success/10 hover:text-success" disabled={cards.length === 0}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Reverse
            </Button>
          </ReactRouterLink>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Cards in this deck</CardTitle>
              <CardDescription>{cards.length} cards total</CardDescription>
            </div>
            <AddCardsToDeckDialog
              deckId={deckId!}
              existingCardIds={existingCardIds}
            />
          </div>
        </CardHeader>
        <CardContent>
          {cardsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <p className="text-muted-foreground">No cards in this deck yet</p>
          ) : (
            <div className="space-y-2">
              {cards.map((card: any) => (
                <div
                  key={card.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-base">{card.word}</p>
                      <p className="text-base text-muted-foreground">
                        {card.translation}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      <CardEditDialog
                        card={card}
                        deckId={deckId!}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4 mr-1.5" />
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          try {
                            await removeCardMutation.mutateAsync(card.id);
                            toast.success("Card removed from deck");
                          } catch {
                            toast.error("Failed to remove card");
                          }
                        }}
                      >
                        <X className="h-4 w-4 mr-1.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="flex sm:hidden items-center gap-2 mt-3 pt-3 border-t border-border">
                    <CardEditDialog
                      card={card}
                      deckId={deckId!}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          <Pencil className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-muted-foreground hover:text-destructive hover:border-destructive"
                      onClick={async () => {
                        try {
                          await removeCardMutation.mutateAsync(card.id);
                          toast.success("Card removed from deck");
                        } catch {
                          toast.error("Failed to remove card");
                        }
                      }}
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
