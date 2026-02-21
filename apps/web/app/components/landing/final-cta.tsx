import { Button } from '@/components/ui/button';

export default function FinalCta() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

  return (
    <section className="bg-foreground py-20 text-background sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Start Building Your Vocabulary Today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
          Join readers who turn every book into a language lesson. Free to start, no credit card required.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <a href={`${appUrl}/sign-up`}>Get Started — It's Free</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
