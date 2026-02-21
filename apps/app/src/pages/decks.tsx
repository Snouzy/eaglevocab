import { DeckList } from "@/features/decks/ui/deck-list";
import { DeckCreateDialog } from "@/features/decks/ui/deck-create-dialog";

export function DecksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">My Decks</h1>
          <p className="text-muted-foreground">
            Group your vocabulary cards by theme
          </p>
        </div>
        <DeckCreateDialog />
      </div>
      <DeckList />
    </div>
  );
}
