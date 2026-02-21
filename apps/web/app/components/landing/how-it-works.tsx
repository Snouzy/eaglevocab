import { BookPlus, Zap, GraduationCap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: BookPlus,
      title: 'Add Words From Your Books',
      description:
        'Found a new word while reading? Add it in one tap. Each word is linked to its book and language.',
    },
    {
      number: '02',
      icon: Zap,
      title: 'Get Instant AI Translation',
      description:
        'Our AI provides translation, pronunciation, definition, and example sentences — instantly.',
    },
    {
      number: '03',
      icon: GraduationCap,
      title: 'Study & Never Forget',
      description:
        'Review with smart flashcards. Spaced repetition ensures every word sticks for good.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-muted py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-center text-lg text-muted-foreground">
          Three simple steps to never forget a word again.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 md:grid-cols-3 sm:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-border sm:text-6xl">
                  {step.number}
                </div>
                <div className="mt-4 flex justify-center">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
