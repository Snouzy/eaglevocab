import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface AnswerButtonsProps {
  onAnswer: (quality: number) => void;
  disabled: boolean;
}

const buttons = [
  { quality: 1, label: "Again", shortcut: "1", className: "bg-red-500 hover:bg-red-600 text-white" },
  { quality: 2, label: "Hard", shortcut: "2", className: "bg-orange-500 hover:bg-orange-600 text-white" },
  { quality: 3, label: "Good", shortcut: "3", className: "bg-blue-500 hover:bg-blue-600 text-white" },
  { quality: 4, label: "Easy", shortcut: "4", className: "bg-green-500 hover:bg-green-600 text-white" },
];

export function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground text-center mb-2">How well did you remember this word?</p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        className="grid grid-cols-4 gap-2"
      >
      {buttons.map((btn) => (
        <motion.button
          key={btn.quality}
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={() => onAnswer(btn.quality)}
          disabled={disabled}
          className={cn(
            "py-4 rounded-xl font-semibold",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            btn.className
          )}
        >
          <span className="block text-lg">{btn.label}</span>
          <span className="block text-xs opacity-70">{btn.shortcut}</span>
        </motion.button>
      ))}
    </motion.div>
    </>
  );
}
