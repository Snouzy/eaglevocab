import { apiClient } from "@/shared/lib/api-client";
import { ApiResponse, ReadwiseImportInput, ReadwiseImportBatchInput } from "@eagle-vocab/types";

export interface ReadwiseBook {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string | null;
}

export interface ReadwiseHighlight {
  id: number;
  text: string;
  highlightedAt: string;
}

export interface ReadwiseImportResult {
  imported: number;
  total: number;
  errors: string[];
}

export interface ReadwiseBatchResult {
  imported: number;
  errors: number;
}

export async function getReadwiseBooks() {
  return apiClient<ApiResponse<{ books: ReadwiseBook[] }>>("/api/readwise/books");
}

export async function getReadwiseHighlights(bookId: number) {
  return apiClient<ApiResponse<{ highlights: ReadwiseHighlight[] }>>(`/api/readwise/books/${bookId}/highlights`);
}

export async function importReadwiseHighlights(data: ReadwiseImportInput) {
  return apiClient<ApiResponse<ReadwiseImportResult>>("/api/readwise/import", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function importReadwiseBatch(data: ReadwiseImportBatchInput) {
  return apiClient<ApiResponse<ReadwiseBatchResult>>("/api/readwise/import/batch", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
