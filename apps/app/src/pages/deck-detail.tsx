import { Link as ReactRouterLink, useParams } from "react-router";
import { useCards } from "@/features/cards/hooks/use-cards";
import { useDeckDetail } from "@/features/decks/hooks/use-decks";
import { AddCardsToDeckDialog } from "@/features/decks/ui/add-cards-to-deck-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, GraduationCap } from "lucide-react";

export function DeckDetailPage() {
  const { deckId } = useParams();
  const { data: deckData, isLoading: deckLoading } = useDeckDetail(deckId!);
  const { data: cardsData, isLoading: cardsLoading } = useCards(deckId!);

  const deck = deckData?.data;
  const cards = cardsData?.data?.cards || [];
  const existingCardIds = cards.map((card: any) => card.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ReactRouterLink to="/decks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </ReactRouterLink>
        <div>
          {deckLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">{deck?.name}</h1>
              <p className="text-muted-foreground">{deck?.description}</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <ReactRouterLink to={`/study/${deckId}?mode=normal`}>
            <Button disabled={cards.length === 0}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Study
            </Button>
          </ReactRouterLink>
          <ReactRouterLink to={`/study/${deckId}?mode=reverse`}>
            <Button variant="outline" disabled={cards.length === 0}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Reverse
            </Button>
          </ReactRouterLink>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cards in this deck</CardTitle>
            <CardDescription>{cards.length} cards total</CardDescription>
          </div>
          <AddCardsToDeckDialog
            deckId={deckId!}
            existingCardIds={existingCardIds}
          />
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
                  className="flex justify-between items-center p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{card.word}</p>
                    <p className="text-sm text-muted-foreground">
                      {card.translation}
                    </p>
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
