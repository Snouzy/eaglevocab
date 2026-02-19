import { useQuery } from "@tanstack/react-query";
import { getCards } from "../lib/card.api";

export function useCards(deckId?: string) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCards(deckId),
  });
}
