import { Link as ReactRouterLink, useParams, useNavigate } from "react-router";
import { useBookDetail, useRemoveCardFromBook } from "@/features/books/hooks/use-books";
import { CardEditDialog } from "@/features/cards/ui/card-edit-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Pencil, X, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export function BookDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { data: bookData, isLoading: bookLoading } = useBookDetail(bookId!);
  const removeCardMutation = useRemoveCardFromBook(bookId!);

  const book = bookData?.data;
  const cards = book?.cards || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <ReactRouterLink to="/books">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </ReactRouterLink>
        <div className="flex-1 min-w-0">
          {bookLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{book?.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                {book?.author && <span>by {book.author}</span>}
                {book?.language && (
                  <span>{book.language.flag} {book.language.name}</span>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <ReactRouterLink to={`/study/book/${bookId}?mode=normal`}>
            <Button variant="success" disabled={cards.length === 0}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Study
            </Button>
          </ReactRouterLink>
          <ReactRouterLink to={`/study/book/${bookId}?mode=reverse`}>
            <Button variant="outline" className="text-success border-success hover:bg-success/10 hover:text-success" disabled={cards.length === 0}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Reverse
            </Button>
          </ReactRouterLink>
          <Button onClick={() => navigate(`/cards/new?bookId=${bookId}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Word
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Words in this book</CardTitle>
          <CardDescription>{cards.length} words total</CardDescription>
        </CardHeader>
        <CardContent>
          {bookLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <p className="text-muted-foreground">No words in this book yet. Add your first word!</p>
          ) : (
            <div className="space-y-2">
              {cards.map((card: any) => (
                <div
                  key={card.id}
                  className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{card.word}</p>
                    <p className="text-sm text-muted-foreground">
                      {card.translation}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CardEditDialog
                      card={card}
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
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
                          toast.success("Word removed from book");
                        } catch {
                          toast.error("Failed to remove word");
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
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
