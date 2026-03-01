import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const PARTICLE_COLORS = ["#22c55e", "#eab308", "#84cc16", "#f59e0b"];

function FeedbackParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        angle: (i / 16) * 360 + (i % 2 === 0 ? 8 : -8),
        distance: 70 + (i % 3) * 25,
        size: 4 + (i % 3) * 2,
        delay: (i % 5) * 0.025,
        color: PARTICLE_COLORS[i % 4],
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
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

  const feedback = feedbackQuality
    ? FEEDBACK_ANIMATIONS[feedbackQuality]
    : null;

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
        {card.examples && card.examples.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border text-left">
            {card.examples.map((ex: any, i: number) => (
              <div key={i} className="p-2.5 bg-muted rounded-lg text-base">
                <p className="font-medium">{ex.sentence}</p>
                <p className="text-muted-foreground">{ex.translation}</p>
              </div>
            ))}
          </div>
        )}
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
        {card.examples && card.examples.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border text-left">
            {card.examples.map((ex: any, i: number) => (
              <div key={i} className="p-2.5 bg-muted rounded-lg text-base">
                <p className="font-medium">{ex.sentence}</p>
                <p className="text-muted-foreground">{ex.translation}</p>
              </div>
            ))}
          </div>
        )}
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
        {feedbackQuality === 4 && <FeedbackParticles />}
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
