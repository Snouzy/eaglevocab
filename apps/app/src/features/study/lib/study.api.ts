import { apiClient } from "@/shared/lib/api-client";
import { ReviewCardInput, ApiResponse } from "@eagle-vocab/types";
import { type StudyCard } from "./study-session";

export interface DeckStudyData {
  cards: StudyCard[];
  deckName: string;
}

export interface BookStudyData {
  cards: StudyCard[];
  bookTitle: string;
}

export async function getStudyCards(deckId: string) {
  return apiClient<ApiResponse<DeckStudyData>>(
    `/api/decks/${deckId}/study-cards`
  );
}

export async function getBookStudyCards(bookId: string) {
  return apiClient<ApiResponse<BookStudyData>>(
    `/api/books/${bookId}/study-cards`
  );
}

export async function reviewCard(cardId: string, data: ReviewCardInput) {
  return apiClient<ApiResponse<any>>(`/api/cards/${cardId}/review`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
