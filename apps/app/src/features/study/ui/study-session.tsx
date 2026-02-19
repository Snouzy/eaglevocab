import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { useStudyCards, useBookStudyCards, useReviewCard } from "../hooks/use-study";
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
  deckId?: string;
  bookId?: string;
  mode: StudyMode;
}

export function StudySession({ deckId, bookId, mode }: StudySessionProps) {
  const navigate = useNavigate();
  const deckQuery = useStudyCards(deckId || "");
  const bookQuery = useBookStudyCards(bookId || "");
  const isBook = !!bookId;
  const { data, isLoading } = isBook ? bookQuery : deckQuery;
  const reviewMutation = useReviewCard();
  const [session, setSession] = useState<SessionState | null>(null);

  const cards = data?.data?.cards;
  const sessionName = isBook ? (data?.data?.bookTitle || "Book") : (data?.data?.deckName || "Deck");

  useEffect(() => {
    if (cards && cards.length > 0 && !session) {
      setSession(createSession(cards, mode));
    }
  }, [cards, mode, session]);

  const handleFlip = useCallback(() => {
    if (!session || session.isComplete) return;
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
    if (isBook) {
      navigate(`/books/${bookId}`);
    } else {
      navigate(`/decks/${deckId}`);
    }
  }, [navigate, deckId, bookId, isBook]);

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
      <div className="flex flex-col items-center justify-center h-dvh gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-lg rounded-2xl" />
        <Skeleton className="h-12 w-full max-w-sm" />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh gap-4 p-6">
        <h1 className="text-2xl font-bold">No cards to study</h1>
        <p className="text-muted-foreground">
          {isBook ? "Add some words to this book first." : "Add some cards to this deck first."}
        </p>
        <Button onClick={handleExit}>{isBook ? "Back to Book" : "Back to Deck"}</Button>
      </div>
    );
  }

  if (!session) return null;

  if (session.isComplete) {
    return (
      <StudySummary
        results={session.results}
        deckName={sessionName}
        onStudyAgain={handleStudyAgain}
        onBackToDeck={handleExit}
      />
    );
  }

  const currentCard = session.cards[session.currentIndex]!;

  return (
    <div className="flex flex-col h-dvh bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            {mode === "normal" ? "Normal" : "Reverse"} — {sessionName}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExit}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
          <span className="ml-1 text-xs hidden sm:inline">ESC</span>
        </Button>
      </div>

      {/* Progress */}
      <div className="px-4 shrink-0">
        <StudyProgress
          current={session.currentIndex}
          total={session.cards.length}
        />
      </div>

      {/* Card — takes all remaining space */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={session.currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full flex items-center justify-center"
          >
            <StudyCardComponent
              card={currentCard}
              isFlipped={session.isFlipped}
              mode={session.mode}
              onFlip={handleFlip}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 px-4 pb-[env(safe-area-inset-bottom,8px)] mb-3">
        <AnimatePresence mode="wait">
          {!session.isFlipped ? (
            <motion.button
              key="flip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={handleFlip}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg active:scale-[0.98] transition-transform"
            >
              Tap to flip
            </motion.button>
          ) : (
            <motion.div
              key="answers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AnswerButtons onAnswer={handleAnswer} disabled={false} />
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-center text-xs text-muted-foreground mt-2 hidden sm:block">
          {!session.isFlipped
            ? "Press Space to flip"
            : "Press 1-4 to rate"
          }
        </p>
      </div>
    </div>
  );
}
