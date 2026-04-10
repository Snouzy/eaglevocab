import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReadwiseBooks,
  getReadwiseHighlights,
  importReadwiseHighlights,
} from "../lib/readwise.api";

export function useReadwiseBooks(enabled = true) {
  return useQuery({
    queryKey: ["readwise-books"],
    queryFn: getReadwiseBooks,
    enabled,
  });
}

export function useReadwiseHighlights(bookId: number) {
  return useQuery({
    queryKey: ["readwise-highlights", bookId],
    queryFn: () => getReadwiseHighlights(bookId),
    enabled: bookId > 0,
  });
}

export function useImportReadwise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importReadwiseHighlights,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
