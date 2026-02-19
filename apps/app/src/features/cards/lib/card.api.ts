import { apiClient } from "@/shared/lib/api-client";
import {
  CreateCardInput,
  UpdateCardInput,
  TranslateRequest,
  TranslationResponse,
} from "@eagle-vocab/types";
import { ApiResponse } from "@eagle-vocab/types";

export async function getCards(deckId?: string, take?: number) {
  const params = new URLSearchParams();
  if (deckId) params.append("deckId", deckId);
  if (take) params.append("take", String(take));
  return apiClient<ApiResponse<any>>(
    `/api/cards${params.toString() ? `?${params}` : ""}`
  );
}

export async function createCard(data: CreateCardInput) {
  return apiClient<ApiResponse<any>>("/api/cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCard(cardId: string, data: UpdateCardInput) {
  return apiClient<ApiResponse<any>>(`/api/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCard(cardId: string) {
  return apiClient<ApiResponse<void>>(`/api/cards/${cardId}`, {
    method: "DELETE",
  });
}

export async function translate(data: TranslateRequest) {
  return apiClient<ApiResponse<TranslationResponse>>("/api/translate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
