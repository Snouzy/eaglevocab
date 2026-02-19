import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDeckSchema, type CreateDeckInput } from "@eagle-vocab/types";
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
import { useCreateDeck } from "../hooks/use-decks";

export function DeckCreateDialog() {
  const [open, setOpen] = useState(false);
  const createDeckMutation = useCreateDeck();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDeckInput>({
    resolver: zodResolver(createDeckSchema),
  });

  async function onSubmit(data: CreateDeckInput) {
    try {
      await createDeckMutation.mutateAsync(data);
      toast.success("Deck created");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create deck");
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button>Create Deck</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create New Deck</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Create a new deck to organize your cards
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Deck Name</Label>
            <p className="text-sm text-muted-foreground mt-0.5">Give your deck a clear name</p>
            <Input
              id="name"
              placeholder="My French Vocabulary"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <p className="text-sm text-muted-foreground mt-0.5">What kind of words will be in this deck?</p>
            <Input
              id="description"
              placeholder="A deck for learning French..."
              {...register("description")}
              className="mt-1"
            />
          </div>
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDeckMutation.isPending}>
              {createDeckMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
