import type { StudyCard, StudyMode } from "../lib/study-session";

interface StudyCardProps {
  card: StudyCard;
  isFlipped: boolean;
  mode: StudyMode;
  onFlip: () => void;
}

export function StudyCardComponent({ card, isFlipped, mode, onFlip }: StudyCardProps) {
  if (!isFlipped) {
    return (
      <div
        onClick={onFlip}
        className="w-full max-w-lg cursor-pointer select-none"
      >
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-lg flex flex-col items-center justify-center min-h-[200px]">
          {mode === "normal" ? (
            <div className="text-center space-y-3">
              <p className="text-3xl sm:text-4xl font-bold">{card.word}</p>
              {card.pronunciation && (
                <p className="text-lg text-muted-foreground">{card.pronunciation}</p>
              )}
              <p className="text-xs text-muted-foreground pt-2">
                {card.sourceLanguage.flag} {card.sourceLanguage.name}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-3xl sm:text-4xl font-bold">{card.translation || "—"}</p>
              <p className="text-xs text-muted-foreground pt-2">
                {card.targetLanguage.flag} {card.targetLanguage.name}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg overflow-y-auto">
      <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-lg space-y-4">
        {mode === "normal" ? (
          <>
            <p className="text-2xl sm:text-3xl font-bold text-center">{card.translation || "—"}</p>
            {card.definition && (
              <p className="text-base text-muted-foreground text-center">{card.definition}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-2xl sm:text-3xl font-bold text-center">{card.word}</p>
            {card.pronunciation && (
              <p className="text-base text-muted-foreground text-center">{card.pronunciation}</p>
            )}
            {card.definition && (
              <p className="text-sm text-muted-foreground text-center">{card.definition}</p>
            )}
          </>
        )}

        {card.examples && card.examples.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            {card.examples.map((ex: any, i: number) => (
              <div key={i} className="p-2.5 bg-muted rounded-lg text-sm">
                <p className="font-medium">{ex.sentence}</p>
                <p className="text-muted-foreground">{ex.translation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
