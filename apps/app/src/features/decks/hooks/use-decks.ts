import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDecks, getDeckDetail, createDeck, deleteDeck, addCardToDeck, removeCardFromDeck, updateDeck } from "../lib/deck.api";

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

export function useRemoveCardFromDeck(deckId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => removeCardFromDeck(deckId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
    },
  });
}

export function useUpdateDeck(deckId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => updateDeck(deckId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}
