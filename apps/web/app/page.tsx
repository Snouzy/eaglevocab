import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold tracking-tighter">
            Learn Vocabulary with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master new languages with AI-powered flashcards, intelligent
            translations, and organized learning paths
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">AI Translation</h3>
            <p className="text-muted-foreground">
              Get instant translations with pronunciation, definitions, and
              examples
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Organized Learning</h3>
            <p className="text-muted-foreground">
              Create decks and books to organize your vocabulary by topic
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Smart Review</h3>
            <p className="text-muted-foreground">
              Review your cards with spaced repetition for better retention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
