import { Link } from "react-router";
import { motion } from "motion/react";
import { CardList } from "@/features/cards/ui/card-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CardsPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">My Cards</h1>
          <p className="text-muted-foreground">
            All your vocabulary words in one place
          </p>
        </div>
        <Link to="/cards/new" className="hidden sm:block">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Card
          </Button>
        </Link>
      </div>
      <CardList />

      <Link to="/cards/new" aria-label="Add new card">
        <motion.div
          className="fixed right-4 bottom-[calc(72px+env(safe-area-inset-bottom)+16px)] lg:bottom-6 z-40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.3 }}
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </Link>
    </div>
  );
}
