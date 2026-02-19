import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookSchema, type CreateBookInput } from "@eagle-vocab/types";
import { toast } from "sonner";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBook } from "../hooks/use-books";
import { useLanguages } from "@/features/cards/hooks/use-languages";

export function BookCreateDialog() {
  const [open, setOpen] = useState(false);
  const createBookMutation = useCreateBook();
  const { data: languagesData } = useLanguages();

  const languages = languagesData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
  });

  const languageId = watch("languageId");

  async function onSubmit(data: CreateBookInput) {
    try {
      await createBookMutation.mutateAsync(data);
      toast.success("Book created");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create book");
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button>Create Book</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create New Book</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Create a new book to organize multiple decks
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Book Title</Label>
            <p className="text-sm text-muted-foreground mt-0.5">The name of the book you're reading</p>
            <Input
              id="title"
              placeholder="French Travel Guide"
              {...register("title")}
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="author">Author (Optional)</Label>
            <p className="text-sm text-muted-foreground mt-0.5">The author's name (optional)</p>
            <Input
              id="author"
              placeholder="John Doe"
              {...register("author")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <p className="text-sm text-muted-foreground mt-0.5">The language the book is written in</p>
            <Select
              value={languageId}
              onValueChange={(value) => setValue("languageId", value)}
            >
              <SelectTrigger id="language" className="mt-1">
                <SelectValue placeholder="Select a language..." />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang: any) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createBookMutation.isPending}>
              {createBookMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
