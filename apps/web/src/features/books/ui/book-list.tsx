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
import { useBooks, useDeleteBook } from "../hooks/use-books";
import { toast } from "sonner";

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
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const books = booksData?.data || [];

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
    <div className="grid gap-4">
      {books.map((book: any) => (
        <Card key={book.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{book.title}</CardTitle>
                {book.author && (
                  <CardDescription>by {book.author}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/books/${book.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {book.deckCount || 0} decks
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
