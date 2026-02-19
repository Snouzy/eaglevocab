import { CardCreateForm } from "@/features/cards/ui/card-create-form";

export function NewCardPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Card</h1>
        <p className="text-muted-foreground">
          Fill in the word and we'll translate it for you.
        </p>
      </div>
      <CardCreateForm />
    </div>
  );
}
