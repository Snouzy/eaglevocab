import { useMutation } from "@tanstack/react-query";
import { translate } from "../lib/card.api";

export function useTranslate() {
  return useMutation({
    mutationFn: translate,
  });
}
