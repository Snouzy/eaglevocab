"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDecks, useDeleteDeck } from "../hooks/use-decks";
import { toast } from "sonner";

export function DeckList() {
  const { data: decksData, isLoading } = useDecks();
  const deleteDeckMutation = useDeleteDeck();

  const handleDelete = async (deckId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDeckMutation.mutateAsync(deckId);
      toast.success("Deck deleted");
    } catch (error) {
      toast.error("Failed to delete deck");
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const decks = decksData?.data?.decks || [];

  if (decks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No decks yet. Create your first deck!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {decks.map((deck: any) => (
        <Card key={deck.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{deck.name}</CardTitle>
                <CardDescription>{deck.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href={`/decks/${deck.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(deck.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {deck.cardCount || 0} cards
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
