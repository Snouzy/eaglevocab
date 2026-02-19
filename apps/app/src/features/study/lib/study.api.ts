import { apiClient } from "@/shared/lib/api-client";
import { ReviewCardInput, ApiResponse } from "@eagle-vocab/types";

export async function getStudyCards(deckId: string) {
  return apiClient<ApiResponse<{ cards: any[]; deckName: string }>>(
    `/api/decks/${deckId}/study-cards`
  );
}

export async function reviewCard(cardId: string, data: ReviewCardInput) {
  return apiClient<ApiResponse<any>>(`/api/cards/${cardId}/review`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
