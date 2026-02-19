import { cn } from "@/shared/lib/utils";
import type { StudyCard, StudyMode } from "../lib/study-session";

interface StudyCardProps {
  card: StudyCard;
  isFlipped: boolean;
  mode: StudyMode;
  onFlip: () => void;
}

export function StudyCardComponent({ card, isFlipped, mode, onFlip }: StudyCardProps) {
  const frontContent = mode === "normal" ? (
    <div className="text-center space-y-4">
      <p className="text-4xl font-bold">{card.word}</p>
      {card.pronunciation && (
        <p className="text-xl text-muted-foreground">{card.pronunciation}</p>
      )}
      <p className="text-sm text-muted-foreground mt-8">
        {card.sourceLanguage.flag} {card.sourceLanguage.name}
      </p>
    </div>
  ) : (
    <div className="text-center space-y-4">
      <p className="text-4xl font-bold">{card.translation || "—"}</p>
      <p className="text-sm text-muted-foreground mt-8">
        {card.targetLanguage.flag} {card.targetLanguage.name}
      </p>
    </div>
  );

  const backContent = mode === "normal" ? (
    <div className="text-center space-y-6 w-full">
      <p className="text-3xl font-bold">{card.translation || "—"}</p>
      {card.definition && (
        <p className="text-lg text-muted-foreground">{card.definition}</p>
      )}
      {card.examples && card.examples.length > 0 && (
        <div className="space-y-3 text-left">
          {card.examples.map((ex: any, i: number) => (
            <div key={i} className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium">{ex.sentence}</p>
              <p className="text-muted-foreground">{ex.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="text-center space-y-6 w-full">
      <p className="text-3xl font-bold">{card.word}</p>
      {card.pronunciation && (
        <p className="text-xl text-muted-foreground">{card.pronunciation}</p>
      )}
      {card.definition && (
        <p className="text-lg text-muted-foreground">{card.definition}</p>
      )}
      {card.examples && card.examples.length > 0 && (
        <div className="space-y-3 text-left">
          {card.examples.map((ex: any, i: number) => (
            <div key={i} className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium">{ex.sentence}</p>
              <p className="text-muted-foreground">{ex.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto cursor-pointer" onClick={() => !isFlipped && onFlip()}>
      <div
        className={cn(
          "relative w-full min-h-[400px] transition-transform duration-500 transform-style-preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-border bg-card p-8 flex flex-col items-center justify-center shadow-xl">
          {frontContent}
          {!isFlipped && (
            <p className="absolute bottom-6 text-sm text-muted-foreground animate-pulse">
              Press Space or click to flip
            </p>
          )}
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-border bg-card p-8 flex flex-col items-center justify-center shadow-xl overflow-y-auto">
          {backContent}
        </div>
      </div>
    </div>
  );
}
