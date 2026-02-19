import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCards, updateCard, deleteCard } from "../lib/card.api";

export function useCards(deckId?: string, take?: number) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCards(deckId, take),
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

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
