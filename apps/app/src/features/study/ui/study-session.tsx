import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { useStudyCards, useReviewCard } from "../hooks/use-study";
import { StudyCardComponent } from "./study-card";
import { AnswerButtons } from "./answer-buttons";
import { StudyProgress } from "./study-progress";
import { StudySummary } from "./study-summary";
import {
  createSession,
  flipCard,
  answerCard,
  type StudyMode,
  type SessionState,
} from "../lib/study-session";

interface StudySessionProps {
  deckId: string;
  mode: StudyMode;
}

export function StudySession({ deckId, mode }: StudySessionProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useStudyCards(deckId);
  const reviewMutation = useReviewCard();
  const [session, setSession] = useState<SessionState | null>(null);

  const cards = data?.data?.cards;
  const deckName = data?.data?.deckName || "Deck";

  useEffect(() => {
    if (cards && cards.length > 0 && !session) {
      setSession(createSession(cards, mode));
    }
  }, [cards, mode, session]);

  const handleFlip = useCallback(() => {
    if (!session || session.isFlipped || session.isComplete) return;
    setSession(flipCard(session));
  }, [session]);

  const handleAnswer = useCallback(
    (quality: number) => {
      if (!session || !session.isFlipped || session.isComplete) return;
      const currentCard = session.cards[session.currentIndex]!;
      reviewMutation.mutate({ cardId: currentCard.id, quality });
      setSession(answerCard(session, quality));
    },
    [session, reviewMutation]
  );

  const handleExit = useCallback(() => {
    navigate(`/decks/${deckId}`);
  }, [navigate, deckId]);

  const handleStudyAgain = useCallback(() => {
    if (!cards) return;
    setSession(createSession(cards, mode));
  }, [cards, mode]);

  useHotkeys("space", (e) => { e.preventDefault(); handleFlip(); }, { enableOnFormTags: false }, [handleFlip]);
  useHotkeys("1", () => handleAnswer(1), [handleAnswer]);
  useHotkeys("2", () => handleAnswer(2), [handleAnswer]);
  useHotkeys("3", () => handleAnswer(3), [handleAnswer]);
  useHotkeys("4", () => handleAnswer(4), [handleAnswer]);
  useHotkeys("escape", handleExit, [handleExit]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full max-w-2xl rounded-2xl" />
        <Skeleton className="h-12 w-96" />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
        <h1 className="text-3xl font-bold">No cards to study</h1>
        <p className="text-muted-foreground">Add some cards to this deck first.</p>
        <Button onClick={handleExit}>Back to Deck</Button>
      </div>
    );
  }

  if (!session) return null;

  if (session.isComplete) {
    return (
      <StudySummary
        results={session.results}
        deckName={deckName}
        onStudyAgain={handleStudyAgain}
        onBackToDeck={handleExit}
      />
    );
  }

  const currentCard = session.cards[session.currentIndex]!;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExit}
        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
      >
        <X className="h-5 w-5" />
        <span className="ml-1 text-xs">ESC</span>
      </Button>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-muted-foreground">
          {mode === "normal" ? "Normal Mode" : "Reverse Mode"}
        </h2>
        <p className="text-sm text-muted-foreground">{deckName}</p>
      </div>

      <StudyProgress
        current={session.currentIndex}
        total={session.cards.length}
      />

      <StudyCardComponent
        card={currentCard}
        isFlipped={session.isFlipped}
        mode={session.mode}
        onFlip={handleFlip}
      />

      <AnswerButtons
        onAnswer={handleAnswer}
        disabled={!session.isFlipped}
      />

      {!session.isFlipped && (
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono">Space</kbd> to flip
        </p>
      )}

      {session.isFlipped && (
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono">1</kbd>-<kbd className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono">4</kbd> to rate
        </p>
      )}
    </div>
  );
}
