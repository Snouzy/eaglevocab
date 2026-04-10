import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Loader2, BookOpen, Download, Check, Search } from "lucide-react";
import {
  useReadwiseBooks,
  useReadwiseHighlights,
  useImportReadwise,
} from "../hooks/use-readwise";
import type { ReadwiseBook, ReadwiseHighlight } from "../lib/readwise.api";
import { toast } from "sonner";

interface ReadwiseImportDialogProps {
  bookId?: string;
  sourceLanguageId?: string;
  targetLanguageId?: string;
  trigger: React.ReactNode;
}

export function ReadwiseImportDialog({
  bookId,
  sourceLanguageId,
  targetLanguageId,
  trigger,
}: ReadwiseImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedReadwiseBook, setSelectedReadwiseBook] = useState<{
    id: number;
    title: string;
    author: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const readwiseBooksQuery = useReadwiseBooks(open);
  const readwiseHighlightsQuery = useReadwiseHighlights(
    selectedReadwiseBook?.id ?? 0
  );
  const importMutation = useImportReadwise();

  const handleSelectBook = (book: { id: number; title: string; author: string }) => {
    setSelectedReadwiseBook(book);
    setStep(2);
  };

  const handleImport = async () => {
    if (!selectedReadwiseBook || !sourceLanguageId || !targetLanguageId) {
      toast.error("Missing required information");
      return;
    }

    setStep(3);
    await importMutation.mutateAsync({
      readwiseBookId: selectedReadwiseBook.id,
      bookId: bookId || undefined,
      createBook: !bookId
        ? {
            title: selectedReadwiseBook.title,
            author: selectedReadwiseBook.author,
            languageId: sourceLanguageId,
          }
        : undefined,
      sourceLanguageId,
      targetLanguageId,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelectedReadwiseBook(null);
      setSearchQuery("");
    }, 200);
  };

  const filteredBooks =
    readwiseBooksQuery.data?.data?.books?.filter((book: ReadwiseBook) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const highlights = readwiseHighlightsQuery.data?.data?.highlights ?? [];
  const highlightCount = highlights.length;

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {step === 1 && "Select Readwise Book"}
            {step === 2 && "Preview Highlights"}
            {step === 3 && "Import Results"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="min-h-96">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-books" className="text-sm font-medium">
                  Search books
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search-books"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {readwiseBooksQuery.isLoading ? (
                  <>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </>
                ) : filteredBooks.length > 0 ? (
                  filteredBooks.map((book: ReadwiseBook) => (
                    <button
                      key={book.id}
                      onClick={() =>
                        handleSelectBook({
                          id: book.id,
                          title: book.title,
                          author: book.author || "Unknown",
                        })
                      }
                      className="w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {book.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {book.author || "Unknown author"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "No books found"
                        : "No books available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && selectedReadwiseBook && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  Found <span className="font-semibold">{highlightCount}</span>{" "}
                  words in
                </p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {selectedReadwiseBook.title}
                </p>
              </div>

              {readwiseHighlightsQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-28" />
                </div>
              ) : highlightCount > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {highlights.map(
                      (highlight: ReadwiseHighlight, idx: number) => (
                        <div
                          key={idx}
                          className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground"
                        >
                          {highlight.text}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No highlights found
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setSelectedReadwiseBook(null);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={highlightCount === 0 || importMutation.isPending}
                  className="flex-1"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import {highlightCount} words
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Translating and importing...
                  </p>
                </>
              ) : importMutation.isSuccess ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      Import successful
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Imported {highlightCount} words from{" "}
                      {selectedReadwiseBook?.title}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-destructive">
                    Import failed. Please try again.
                  </p>
                </>
              )}

              <Button
                onClick={handleClose}
                className="w-full"
                disabled={importMutation.isPending}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
