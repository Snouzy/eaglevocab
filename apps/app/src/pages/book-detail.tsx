import { Link as ReactRouterLink, useParams } from "react-router";
import { useBookDetail } from "@/features/books/hooks/use-books";
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

export function BookDetailPage() {
  const { bookId } = useParams();
  const { data: bookData, isLoading: bookLoading } = useBookDetail(bookId!);

  const book = bookData?.data;
  const decks = book?.decks || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ReactRouterLink to="/books">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </ReactRouterLink>
        <div>
          {bookLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{book?.title}</h1>
              {book?.author && (
                <p className="text-muted-foreground">by {book.author}</p>
              )}
            </>
          )}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Decks in this book</CardTitle>
          <CardDescription>{decks.length} decks total</CardDescription>
        </CardHeader>
        <CardContent>
          {bookLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : decks.length === 0 ? (
            <p className="text-muted-foreground">No decks in this book yet</p>
          ) : (
            <div className="space-y-2">
              {decks.map((deck: any) => (
                <ReactRouterLink
                  key={deck.id}
                  to={`/decks/${deck.id}`}
                  className="block p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-medium">{deck.name}</p>
                  {deck.description && (
                    <p className="text-sm text-muted-foreground">
                      {deck.description}
                    </p>
                  )}
                </ReactRouterLink>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
