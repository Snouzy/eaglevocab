import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDecks, getDeckDetail, createDeck, deleteDeck, addCardToDeck } from "../lib/deck.api";

export function useDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: getDecks,
  });
}

export function useDeckDetail(deckId: string) {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeckDetail(deckId),
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useAddCardToDeck(deckId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => addCardToDeck(deckId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
    },
  });
}
