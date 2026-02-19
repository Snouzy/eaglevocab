import { useQuery, useMutation } from "@tanstack/react-query";
import { getStudyCards, reviewCard } from "../lib/study.api";

export function useStudyCards(deckId: string) {
  return useQuery({
    queryKey: ["study-cards", deckId],
    queryFn: () => getStudyCards(deckId),
    staleTime: 0,
  });
}

export function useReviewCard() {
  return useMutation({
    mutationFn: ({ cardId, quality }: { cardId: string; quality: number }) =>
      reviewCard(cardId, { quality }),
  });
}
