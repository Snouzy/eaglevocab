import { Sparkles, BookOpen, Brain, Languages } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Translation',
      description:
        'Enter any word and instantly get its translation, phonetic pronunciation with accents, definition, and example sentences. Powered by AI, accurate for any language pair.',
    },
    {
      icon: BookOpen,
      title: 'Organized by Book',
      description:
        "Track vocabulary for each book you're reading. Every book is tied to a language, keeping your learning structured and contextual.",
    },
    {
      icon: Brain,
      title: 'Smart Spaced Repetition',
      description:
        'Study with flashcards using the SM-2 algorithm. Rate your recall, and the app schedules reviews at the perfect moment for long-term retention.',
    },
    {
      icon: Languages,
      title: 'Decks & Multi-Language',
      description:
        'Group cards by theme — travel, food, verbs — independently from books. Set your native language once, learn as many languages as you want.',
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Everything You Need to Learn Vocabulary
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
          From the page to your memory, Eagle Vocab covers every step.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-xl bg-muted p-6 sm:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
