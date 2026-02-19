import { Link } from "react-router";
import { motion } from "motion/react";
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
import { Eye, Trash2 } from "lucide-react";

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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck: any, i: number) => (
        <motion.div
          key={deck.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card className="shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="truncate">{deck.name}</CardTitle>
              {deck.description && (
                <CardDescription className="line-clamp-2">
                  {deck.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {deck.cards?.length ?? 0} cards
              </p>
              <div className="flex gap-2">
                <Link to={`/decks/${deck.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(deck.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
