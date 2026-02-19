import { apiClient } from "@/shared/lib/api-client";
import { CreateDeckInput, UpdateDeckInput } from "@eagle-vocab/types";
import { ApiResponse } from "@eagle-vocab/types";

export async function getDecks() {
  return apiClient<ApiResponse<any>>("/api/decks");
}

export async function getDeckDetail(deckId: string) {
  return apiClient<ApiResponse<any>>(`/api/decks/${deckId}`);
}

export async function createDeck(data: CreateDeckInput) {
  return apiClient<ApiResponse<any>>("/api/decks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDeck(deckId: string, data: UpdateDeckInput) {
  return apiClient<ApiResponse<any>>(`/api/decks/${deckId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDeck(deckId: string) {
  return apiClient<ApiResponse<void>>(`/api/decks/${deckId}`, {
    method: "DELETE",
  });
}

export async function addCardToDeck(deckId: string, cardId: string) {
  return apiClient<ApiResponse<any>>(`/api/decks/${deckId}/cards`, {
    method: "POST",
    body: JSON.stringify({ cardId }),
  });
}

export async function removeCardFromDeck(deckId: string, cardId: string) {
  return apiClient<ApiResponse<void>>(`/api/decks/${deckId}/cards/${cardId}`, {
    method: "DELETE",
  });
}
