import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCards, updateCard } from "../lib/card.api";

export function useCards(deckId?: string) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCards(deckId),
  });
}

export function useUpdateCard(deckId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: any }) =>
      updateCard(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      queryClient.invalidateQueries({ queryKey: ["cards", undefined] });
    },
  });
}
