import { useParams, useSearchParams } from "react-router";
import { StudySession } from "@/features/study/ui/study-session";
import type { StudyMode } from "@/features/study/lib/study-session";

export function StudyPage() {
  const { deckId, bookId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") || "normal") as StudyMode;

  return <StudySession deckId={deckId} bookId={bookId} mode={mode} />;
}
