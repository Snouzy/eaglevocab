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
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useBooks, useDeleteBook } from "../hooks/use-books";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

export function BookList() {
  const { data: booksData, isLoading } = useBooks();
  const deleteBookMutation = useDeleteBook();
  const { confirm, confirmDialog } = useConfirm({
    title: "Delete this book?",
    description: "All decks and cards linked to this book will be permanently deleted.",
    confirmLabel: "Delete",
  });

  const handleDelete = async (bookId: string) => {
    if (!(await confirm())) return;
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
    <>
    {confirmDialog}
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book: any, i: number) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card className="shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
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
        </motion.div>
      ))}
    </div>
    </>
  );
}
