import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useCards, useDeleteCard } from "../hooks/use-cards";
import { CardEditDialog } from "./card-edit-dialog";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

export function CardList() {
  const { data: cardsData, isLoading } = useCards(undefined, 200);
  const deleteCardMutation = useDeleteCard();
  const { confirm, confirmDialog } = useConfirm({
    title: "Delete this card?",
    description: "This card will be permanently deleted.",
    confirmLabel: "Delete",
  });

  const handleDelete = async (cardId: string) => {
    if (!(await confirm())) return;
    try {
      await deleteCardMutation.mutateAsync(cardId);
      toast.success("Card deleted");
    } catch (error) {
      toast.error("Failed to delete card");
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

  const cards = cardsData?.data?.cards || [];

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No cards yet. Create your first card!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    {confirmDialog}
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card: any, i: number) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
        >
          <Card className="shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="truncate text-base">{card.word}</CardTitle>
                <div className="flex items-center gap-1 text-base shrink-0">
                  {card.sourceLanguage?.flag}
                  <span className="text-xs text-muted-foreground">→</span>
                  {card.targetLanguage?.flag}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 truncate">
                {card.translation || "No translation"}
              </p>
              <div className="flex gap-2">
                <CardEditDialog
                  card={card}
                  trigger={
                    <Button variant="default" size="sm" className="flex-1">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(card.id)}
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
