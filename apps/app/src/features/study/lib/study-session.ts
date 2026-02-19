export type StudyMode = "normal" | "reverse";

export interface StudyCard {
  id: string;
  word: string;
  translation: string | null;
  pronunciation: string | null;
  definition: string | null;
  examples: Array<{ sentence: string; translation: string }> | null;
  sourceLanguage: { name: string; flag: string | null };
  targetLanguage: { name: string; flag: string | null };
}

export interface SessionState {
  cards: StudyCard[];
  currentIndex: number;
  isFlipped: boolean;
  mode: StudyMode;
  results: ReviewResult[];
  isComplete: boolean;
}

export interface ReviewResult {
  cardId: string;
  quality: number;
  word: string;
}

export function createSession(cards: StudyCard[], mode: StudyMode): SessionState {
  return {
    cards: shuffleCards(cards),
    currentIndex: 0,
    isFlipped: false,
    mode,
    results: [],
    isComplete: false,
  };
}

export function shuffleCards<T>(cards: T[]): T[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function flipCard(state: SessionState): SessionState {
  return { ...state, isFlipped: true };
}

export function answerCard(state: SessionState, quality: number): SessionState {
  const currentCard = state.cards[state.currentIndex]!;
  const result: ReviewResult = {
    cardId: currentCard.id,
    quality,
    word: currentCard.word,
  };

  const newResults = [...state.results, result];
  const nextIndex = state.currentIndex + 1;
  const isComplete = nextIndex >= state.cards.length;

  return {
    ...state,
    results: newResults,
    currentIndex: nextIndex,
    isFlipped: false,
    isComplete,
  };
}

export function getSessionStats(results: ReviewResult[]) {
  const total = results.length;
  const correct = results.filter((r) => r.quality >= 3).length;
  const incorrect = results.filter((r) => r.quality < 3).length;
  return { total, correct, incorrect };
}
