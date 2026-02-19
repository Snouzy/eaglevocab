"use client";

import Link from "next/link";
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

import { use } from "react";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = use(params);
  const { data: bookData, isLoading: bookLoading } = useBookDetail(bookId);

  const book = bookData?.data;
  const decks = book?.decks || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/books">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          {bookLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">{book?.title}</h1>
              {book?.author && (
                <p className="text-muted-foreground">by {book.author}</p>
              )}
            </>
          )}
        </div>
      </div>

      <Card>
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
                <Link
                  key={deck.id}
                  href={`/decks/${deck.id}`}
                  className="block p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <p className="font-medium">{deck.name}</p>
                  {deck.description && (
                    <p className="text-sm text-muted-foreground">
                      {deck.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
