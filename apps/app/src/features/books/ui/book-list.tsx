import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks, useDeleteBook } from "../hooks/use-books";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

export function BookList() {
  const { data: booksData, isLoading } = useBooks();
  const deleteBookMutation = useDeleteBook();

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteBookMutation.mutateAsync(bookId);
      toast.success("Book deleted");
    } catch (error) {
      toast.error("Failed to delete book");
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

  const books = booksData?.data?.books || [];

  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No books yet. Create your first book!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book: any) => (
        <Card key={book.id} className="shadow-sm">
          <CardHeader>
            <CardTitle className="truncate">{book.title}</CardTitle>
            {book.author && (
              <CardDescription className="line-clamp-2">
                by {book.author}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {book.decks?.length ?? 0} decks
            </p>
            <div className="flex gap-2">
              <Link to={`/books/${book.id}`} className="flex-1">
                <Button variant="default" size="sm" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(book.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
