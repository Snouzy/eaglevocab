import { CardCreateForm } from "@/features/cards/ui/card-create-form";

export default function NewCardPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Card</h1>
        <p className="text-muted-foreground">
          Add a new vocabulary card with AI-powered translations
        </p>
      </div>
      <CardCreateForm />
    </div>
  );
}
