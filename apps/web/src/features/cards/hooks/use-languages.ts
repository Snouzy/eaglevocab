import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string | null;
}

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () =>
      apiClient<{ success: boolean; data: Language[] }>("/api/languages"),
    staleTime: Infinity,
  });
}
