import { useQuery, useMutation } from "@tanstack/react-query";
import { getStudyCards, getBookStudyCards, reviewCard } from "../lib/study.api";

export function useStudyCards(deckId: string) {
  return useQuery({
    queryKey: ["study-cards", "deck", deckId],
    queryFn: () => getStudyCards(deckId),
    staleTime: 0,
    enabled: !!deckId,
  });
}

export function useBookStudyCards(bookId: string) {
  return useQuery({
    queryKey: ["study-cards", "book", bookId],
    queryFn: () => getBookStudyCards(bookId),
    staleTime: 0,
    enabled: !!bookId,
  });
}

export function useReviewCard() {
  return useMutation({
    mutationFn: ({ cardId, quality }: { cardId: string; quality: number }) =>
      reviewCard(cardId, { quality }),
  });
}
