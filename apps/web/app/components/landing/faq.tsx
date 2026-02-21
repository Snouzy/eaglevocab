'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const faqs = [
  {
    q: 'Is EagleVocab really free?',
    a: "Yes! The core features — saving words, AI translations, and spaced repetition flashcards — are completely free. No credit card required, no hidden fees.",
  },
  {
    q: 'Which languages are supported?',
    a: "EagleVocab supports 50+ language pairs. Whether you're learning French, Japanese, Korean, German, Spanish, or any other language — we've got you covered.",
  },
  {
    q: 'How does the AI translation work?',
    a: "When you add a word, our AI instantly provides the translation, phonetic pronunciation, definition, and an example sentence in context. It's powered by state-of-the-art language models.",
  },
  {
    q: 'What is spaced repetition?',
    a: "Spaced repetition is a scientifically proven learning technique. Instead of cramming, you review words at increasing intervals — right before you'd forget them. This moves words from short-term to long-term memory.",
  },
  {
    q: 'Can I use it for multiple languages at once?',
    a: 'Absolutely. Set your native language once, then create books in any target language. Switch between languages effortlessly.',
  },
  {
    q: 'Do I need to be reading a physical book?',
    a: `Not at all. "Books" in EagleVocab are simply containers for organizing your vocabulary. You can use them for physical books, ebooks, articles, Netflix shows — anything you're learning from.`,
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase">
            F.A.Q.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="font-bold text-lg pr-4">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-200',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  open === i ? 'max-h-96 pb-5' : 'max-h-0'
                )}
              >
                <div className="px-5 text-neutral-600 leading-relaxed">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
