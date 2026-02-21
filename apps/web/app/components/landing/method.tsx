import { BookPlus, Sparkles, Brain, ArrowDown } from 'lucide-react';

export default function Method() {
  const steps = [
    {
      number: '01',
      icon: BookPlus,
      title: 'Save the word',
      description:
        'Found a new word while reading? Add it in one tap. Each word is linked to its book and language pair.',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'AI does the rest',
      description:
        'Instantly get the translation, pronunciation with accents, definition, and a real example sentence. Powered by AI.',
    },
    {
      number: '03',
      icon: Brain,
      title: 'Never forget it',
      description:
        'Study with smart flashcards. The SM-2 spaced repetition algorithm schedules reviews at the perfect moment for long-term retention.',
    },
  ];

  return (
    <section className="bg-amber-50 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            A method that<br />
            <span className="text-highlight-strong">actually works</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-600 max-w-xl mx-auto">
            Three steps. That&apos;s all it takes to turn every unknown word into lasting knowledge.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {steps.map((step, i) => (
            <div key={i}>
              <div className="bg-white rounded-2xl p-8 sm:p-10 border border-neutral-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-amber-400 w-16 h-16 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-black text-black">{step.number}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="w-6 h-6 text-neutral-900" />
                      <h3 className="text-xl sm:text-2xl font-black uppercase">{step.title}</h3>
                    </div>
                    <p className="text-neutral-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-6 h-6 text-neutral-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
