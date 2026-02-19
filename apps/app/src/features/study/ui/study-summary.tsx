import { Button } from "@/components/ui/button";
import { getSessionStats, type ReviewResult } from "../lib/study-session";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from "lucide-react";

interface StudySummaryProps {
  results: ReviewResult[];
  deckName: string;
  onStudyAgain: () => void;
  onBackToDeck: () => void;
}

export function StudySummary({
  results,
  deckName,
  onStudyAgain,
  onBackToDeck,
}: StudySummaryProps) {
  const { total, correct, incorrect } = getSessionStats(results);
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Header + Score */}
      <div className="shrink-0 pt-8 pb-4 px-4 text-center space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Session Complete!</h1>
          <p className="text-sm text-muted-foreground">{deckName}</p>
        </div>

        <p className="text-5xl sm:text-6xl font-bold">{percentage}%</p>

        <div className="flex justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Cards</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{correct}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-destructive">{incorrect}</p>
            <p className="text-xs text-muted-foreground">To Review</p>
          </div>
        </div>
      </div>

      {/* Results list — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4">
        <div className="max-w-md mx-auto space-y-1.5">
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <span className="font-medium truncate mr-2">{r.word}</span>
              {r.quality >= 3 ? (
                <CheckCircle className="h-5 w-5 text-success shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 px-4 pt-4 pb-[env(safe-area-inset-bottom,16px)] pb-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="outline" className="flex-1 h-12" onClick={onBackToDeck}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button variant="success" className="flex-1 h-12" onClick={onStudyAgain}>
            <RotateCcw className="mr-2 h-4 w-4" /> Study Again
          </Button>
        </div>
      </div>
    </div>
  );
}
