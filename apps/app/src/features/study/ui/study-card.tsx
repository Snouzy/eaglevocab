import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Volume2, Loader2 } from "lucide-react";
import type { StudyCard, StudyMode } from "../lib/study-session";
import { Button } from "@/components/ui/button";
import { useTts } from "../hooks/use-tts";

interface StudyCardProps {
  card: StudyCard;
  isFlipped: boolean;
  mode: StudyMode;
  onFlip: () => void;
  feedbackQuality?: number | null;
}

const FEEDBACK_ANIMATIONS: Record<
  number,
  { keyframes: Record<string, number[]>; glow: string; duration: number }
> = {
  // Shake horizontal + brief dim — "oops, try again"
  1: {
    keyframes: { x: [0, -6, 6, -4, 4, 0], opacity: [1, 0.6, 0.8, 0.9, 1, 1] },
    glow: "0 0 20px rgba(239, 68, 68, 0.35)",
    duration: 0.4,
  },
  // Tilt wobble — "hmm, tough one"
  2: {
    keyframes: { rotateZ: [0, -2, 2, -1, 0], y: [0, 2, -1, 0] },
    glow: "0 0 20px rgba(249, 115, 22, 0.35)",
    duration: 0.35,
  },
  // Upward pop — "nice!"
  3: {
    keyframes: { y: [0, -10, 0], scale: [1, 1.04, 1] },
    glow: "0 0 30px rgba(251, 191, 36, 0.45)",
    duration: 0.35,
  },
  // Celebratory lift + scale + rotation — "jackpot"
  4: {
    keyframes: { y: [0, -18, -4, 0], scale: [1, 1.1, 0.97, 1], rotateZ: [0, -2, 1, 0] },
    glow: "0 0 40px rgba(16, 185, 129, 0.5)",
    duration: 0.5,
  },
};

function fireConfetti() {
  const defaults = {
    particleCount: 40,
    spread: 55,
    ticks: 40,
    gravity: 1.2,
    decay: 0.94,
    startVelocity: 20,
    colors: ["#22c55e", "#10b981", "#eab308", "#84cc16"],
    scalar: 0.8,
    disableForReducedMotion: true,
  };

  confetti({ ...defaults, angle: 60, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, angle: 120, origin: { x: 0.7, y: 0.6 } });
}

export function StudyCardComponent({
  card,
  isFlipped,
  mode,
  onFlip,
  feedbackQuality,
}: StudyCardProps) {
  const { speak, isSpeaking } = useTts();

  const handleTtsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) return;

    if (!isFlipped) {
      if (mode === "normal") {
        speak(card.word, card.sourceLanguage.name);
      } else {
        speak(card.translation || "", card.targetLanguage.name);
      }
    } else {
      if (mode === "normal") {
        speak(card.translation || "", card.targetLanguage.name);
      } else {
        speak(card.word, card.sourceLanguage.name);
      }
    }
  };

  useEffect(() => {
    if (feedbackQuality === 4) fireConfetti();
  }, [feedbackQuality]);

  const feedback = feedbackQuality
    ? FEEDBACK_ANIMATIONS[feedbackQuality]
    : null;

  const handleExampleTts = (e: React.MouseEvent, text: string, lang: string) => {
    e.stopPropagation();
    speak(text, lang);
  };

  const renderExamples = (examples: Array<{ sentence: string; translation: string }>) => (
    <div className="space-y-2 pt-2 border-t border-border text-left">
      {examples.map((ex, i) => (
        <div key={i} className="p-2.5 bg-muted rounded-lg text-base space-y-1">
          <div className="flex items-start gap-1.5">
            <p className="font-medium flex-1">{ex.sentence}</p>
            <button
              onClick={(e) => handleExampleTts(e, ex.sentence, card.sourceLanguage.name)}
              className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Speak example"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-muted-foreground">{ex.translation}</p>
        </div>
      ))}
    </div>
  );

  const frontContent =
    mode === "normal" ? (
      <div className="text-center space-y-3">
        <p className="text-3xl sm:text-4xl font-bold">{card.word}</p>
        {card.pronunciation && (
          <p className="text-xl text-muted-foreground">{card.pronunciation}</p>
        )}
        <p className="text-sm text-muted-foreground pt-2">
          {card.sourceLanguage.flag} {card.sourceLanguage.name}
        </p>
      </div>
    ) : (
      <div className="text-center space-y-3">
        <p className="text-3xl sm:text-4xl font-bold">
          {card.translation || "—"}
        </p>
        <p className="text-sm text-muted-foreground pt-2">
          {card.targetLanguage.flag} {card.targetLanguage.name}
        </p>
      </div>
    );

  const backContent =
    mode === "normal" ? (
      <div className="text-center space-y-4 w-full">
        <p className="text-2xl sm:text-3xl font-bold">
          {card.translation || "—"}
        </p>
        {card.definition && (
          <p className="text-lg text-muted-foreground">{card.definition}</p>
        )}
        {card.examples && card.examples.length > 0 && renderExamples(card.examples)}
      </div>
    ) : (
      <div className="text-center space-y-4 w-full">
        <p className="text-2xl sm:text-3xl font-bold">{card.word}</p>
        {card.pronunciation && (
          <p className="text-xl text-muted-foreground">{card.pronunciation}</p>
        )}
        {card.definition && (
          <p className="text-lg text-muted-foreground">{card.definition}</p>
        )}
        {card.examples && card.examples.length > 0 && renderExamples(card.examples)}
      </div>
    );

  return (
    <div
      className="w-full max-w-2xl select-none"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative rounded-2xl"
        animate={
          feedback
            ? {
                ...feedback.keyframes,
                boxShadow: [
                  "0 0 0px transparent",
                  feedback.glow,
                  "0 0 0px transparent",
                ],
              }
            : {}
        }
        transition={feedback ? { duration: feedback.duration } : {}}
      >
        <Button
          onClick={handleTtsClick}
          variant="ghost"
          size="icon"
          aria-label="Speak text"
          className="absolute top-4 right-4 z-10"
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <AnimatePresence mode="wait" initial={false}>
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onFlip}
              className="rounded-2xl border-2 border-border bg-card p-8 shadow-lg flex flex-col items-center justify-center min-h-[240px] cursor-pointer"
            >
              {frontContent}
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onFlip}
              className="rounded-2xl border-2 border-primary/30 bg-card p-8 shadow-lg flex flex-col items-center cursor-pointer"
            >
              {backContent}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
