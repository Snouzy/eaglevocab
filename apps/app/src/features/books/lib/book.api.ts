import { apiClient } from "@/shared/lib/api-client";
import { CreateBookInput, UpdateBookInput } from "@eagle-vocab/types";
import { ApiResponse } from "@eagle-vocab/types";

export async function getBooks() {
  return apiClient<ApiResponse<any>>("/api/books");
}

export async function getBookDetail(bookId: string) {
  return apiClient<ApiResponse<any>>(`/api/books/${bookId}`);
}

export async function createBook(data: CreateBookInput) {
  return apiClient<ApiResponse<any>>("/api/books", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBook(bookId: string, data: UpdateBookInput) {
  return apiClient<ApiResponse<any>>(`/api/books/${bookId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteBook(bookId: string) {
  return apiClient<ApiResponse<void>>(`/api/books/${bookId}`, {
    method: "DELETE",
  });
}

export async function removeCardFromBook(bookId: string, cardId: string) {
  return apiClient<ApiResponse<void>>(`/api/books/${bookId}/cards/${cardId}`, {
    method: "DELETE",
  });
}
