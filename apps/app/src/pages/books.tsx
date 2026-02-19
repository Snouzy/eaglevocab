import { BookList } from "@/features/books/ui/book-list";
import { BookCreateDialog } from "@/features/books/ui/book-create-dialog";

export function BooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
          <p className="text-muted-foreground">
            All the books you're reading
          </p>
        </div>
        <BookCreateDialog />
      </div>
      <BookList />
    </div>
  );
}
