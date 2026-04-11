interface SrsData {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

interface SrsResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
}

export const calculateNextReview = (
  current: SrsData,
  quality: number
): SrsResult => {
  const qualityMap: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5 };
  const q = qualityMap[quality] ?? 0;

  let { easeFactor, interval, repetitions } = current;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  const newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  easeFactor = Math.max(1.3, newEaseFactor);

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReviewAt };
};
