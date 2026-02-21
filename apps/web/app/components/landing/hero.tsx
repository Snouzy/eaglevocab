import { Button } from '@/components/ui/button';

export default function Hero() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

  return (
    <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 text-sm font-medium">
            ✨ AI-Powered Vocabulary Learning
          </span>

          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Never Forget a Word You Read
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reading in a foreign language? Save new words, get AI-powered translations with pronunciation and examples,
            then master them with smart flashcards — all organized by book.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href={`${appUrl}/sign-up`}>Start Learning Free</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <div className="mt-12 sm:mt-16">
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl bg-background border border-border">
              <div className="bg-muted p-4 flex items-center justify-between">
                <span className="font-semibold text-sm">Les Misérables</span>
                <span className="text-xs font-medium px-2 py-1 bg-background rounded border border-border">
                  French → English
                </span>
              </div>

              <div className="p-8">
                <div className="text-5xl font-bold mb-4">papillon</div>
                <div className="text-2xl text-muted-foreground mb-4">butterfly</div>
                <div className="text-sm text-muted-foreground mb-4">/pa.pi.jɔ̃/</div>
                <div className="italic text-sm text-muted-foreground">
                  "Un papillon bleu dansa dans la lumière du matin."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
