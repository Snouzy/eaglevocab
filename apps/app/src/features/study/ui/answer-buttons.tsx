import { cn } from "@/shared/lib/utils";

interface AnswerButtonsProps {
  onAnswer: (quality: number) => void;
  disabled: boolean;
}

const buttons = [
  { quality: 1, label: "Again", shortcut: "1", className: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white" },
  { quality: 2, label: "Hard", shortcut: "2", className: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white" },
  { quality: 3, label: "Good", shortcut: "3", className: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white" },
  { quality: 4, label: "Easy", shortcut: "4", className: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white" },
];

export function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.quality}
          onClick={() => onAnswer(btn.quality)}
          disabled={disabled}
          className={cn(
            "py-3.5 rounded-xl font-semibold transition-transform active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            btn.className
          )}
        >
          <span className="block text-base">{btn.label}</span>
          <span className="block text-[10px] opacity-70 hidden sm:block">{btn.shortcut}</span>
        </button>
      ))}
    </div>
  );
}
