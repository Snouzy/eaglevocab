import { Link } from "react-router";
import { CardList } from "@/features/cards/ui/card-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
          <p className="text-muted-foreground">
            Manage all your vocabulary cards
          </p>
        </div>
        <Link to="/cards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Card
          </Button>
        </Link>
      </div>
      <CardList />
    </div>
  );
}
