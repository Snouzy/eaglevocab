import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDecks } from "@/features/decks/hooks/use-decks";
import { useBooks } from "@/features/books/hooks/use-books";
import { useCards } from "@/features/cards/hooks/use-cards";

export function DashboardPage() {
  const { data: decksData, isLoading: decksLoading } = useDecks();
  const { data: booksData, isLoading: booksLoading } = useBooks();
  const { data: cardsData, isLoading: cardsLoading } = useCards();

  const decks = decksData?.data?.decks || [];
  const books = booksData?.data?.books || [];
  const cards = cardsData?.data?.cards || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to EagleVocab</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
          </CardHeader>
          <CardContent>
            {decksLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{decks.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Organized learning sets
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            {booksLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{books.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Collections of decks
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {cardsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{cards.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Vocabulary words
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Cards</CardTitle>
            <CardDescription>
              Your most recently created cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cardsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            ) : cards.length === 0 ? (
              <p className="text-muted-foreground">No cards yet</p>
            ) : (
              <div className="space-y-2">
                {cards.slice(0, 5).map((card: any) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span className="font-medium">{card.word}</span>
                    <span className="text-sm text-muted-foreground">
                      {card.translation}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
