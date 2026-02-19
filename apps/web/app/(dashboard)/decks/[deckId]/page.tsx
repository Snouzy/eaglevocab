"use client";

import Link from "next/link";
import { useCards } from "@/features/cards/hooks/use-cards";
import { useDeckDetail } from "@/features/decks/hooks/use-decks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;
  const { data: deckData, isLoading: deckLoading } = useDeckDetail(
    deckId
  );
  const { data: cardsData, isLoading: cardsLoading } = useCards(deckId);

  const deck = deckData?.data;
  const cards = cardsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/decks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cards in this deck</CardTitle>
          <CardDescription>{cards.length} cards total</CardDescription>
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
