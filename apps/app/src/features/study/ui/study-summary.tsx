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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold">Session Complete!</h1>
        <p className="text-xl text-muted-foreground">{deckName}</p>
      </div>

      <div className="text-center">
        <p className="text-7xl font-bold">{percentage}%</p>
        <p className="text-muted-foreground mt-2">Score</p>
      </div>

      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="p-4">
          <p className="text-4xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Cards</p>
        </div>
        <div className="p-4">
          <p className="text-4xl font-bold text-green-500">{correct}</p>
          <p className="text-sm text-muted-foreground">Correct</p>
        </div>
        <div className="p-4">
          <p className="text-4xl font-bold text-red-500">{incorrect}</p>
          <p className="text-sm text-muted-foreground">To Review</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg border border-border"
          >
            <span className="font-medium">{r.word}</span>
            {r.quality >= 3 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <Button variant="outline" size="lg" onClick={onBackToDeck}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck
        </Button>
        <Button size="lg" onClick={onStudyAgain}>
          <RotateCcw className="mr-2 h-4 w-4" /> Study Again
        </Button>
      </div>
    </div>
  );
}
