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
    <div className="flex gap-3 justify-center">
      {buttons.map((btn) => (
        <button
          key={btn.quality}
          onClick={() => onAnswer(btn.quality)}
          disabled={disabled}
          className={cn(
            "px-6 py-3 rounded-xl font-semibold transition-all transform active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none",
            btn.className
          )}
        >
          <span className="block text-lg">{btn.label}</span>
          <span className="block text-xs opacity-70">{btn.shortcut}</span>
        </button>
      ))}
    </div>
  );
}
