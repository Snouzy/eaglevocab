import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBooks, getBookDetail, createBook, deleteBook } from "../lib/book.api";

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
}

export function useBookDetail(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookDetail(bookId),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
