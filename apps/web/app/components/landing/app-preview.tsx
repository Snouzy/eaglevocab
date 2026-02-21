'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

const booksData = [
  {
    title: 'Les Misérables',
    lang: 'FR → EN',
    count: 47,
    dueCards: 12,
    cards: [
      { word: 'éphémère', pron: '/e.fe.mɛʁ/', translation: 'ephemeral', def: 'short-lived, transient' },
      { word: 'papillon', pron: '/pa.pi.jɔ̃/', translation: 'butterfly', def: 'a winged insect with colored wings' },
      { word: 'lumière', pron: '/ly.mjɛʁ/', translation: 'light', def: 'brightness, illumination' },
    ],
  },
  {
    title: 'Der Prozess',
    lang: 'DE → EN',
    count: 23,
    dueCards: 8,
    cards: [
      { word: 'Schuld', pron: '/ʃʊlt/', translation: 'guilt', def: 'responsibility for wrongdoing' },
      { word: 'Gericht', pron: '/ɡəˈʁɪçt/', translation: 'court', def: 'a judicial tribunal' },
      { word: 'Freiheit', pron: '/ˈfʁaɪ̯haɪ̯t/', translation: 'freedom', def: 'the state of being free' },
    ],
  },
  {
    title: '人間失格',
    lang: 'JA → EN',
    count: 31,
    dueCards: 15,
    cards: [
      { word: '恥', pron: '/haji/', translation: 'shame', def: 'a painful feeling of humiliation' },
      { word: '人間', pron: '/ningen/', translation: 'human', def: 'a person, humanity' },
      { word: '孤独', pron: '/kodoku/', translation: 'solitude', def: 'the state of being alone' },
    ],
  },
  {
    title: 'Cien años de soledad',
    lang: 'ES → EN',
    count: 18,
    dueCards: 6,
    cards: [
      { word: 'soledad', pron: '/so.le.ˈðað/', translation: 'solitude', def: 'the state of being alone' },
      { word: 'mariposa', pron: '/ma.ɾi.ˈpo.sa/', translation: 'butterfly', def: 'a winged insect' },
      { word: 'olvido', pron: '/ol.ˈbi.ðo/', translation: 'oblivion', def: 'the state of being forgotten' },
    ],
  },
];

const ratings = [
  { label: 'Again', color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
  { label: 'Hard', color: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' },
  { label: 'Good', color: 'bg-amber-400 text-black hover:bg-amber-300' },
  { label: 'Easy', color: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' },
];

export default function AppPreview() {
  const [activeBook, setActiveBook] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const book = booksData[activeBook]!;
  const card = book.cards[cardIndex]!;

  function selectBook(index: number) {
    if (index === activeBook) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveBook(index);
      setCardIndex(0);
      setRevealed(false);
      setAnimating(false);
    }, 150);
  }

  function reveal() {
    if (!revealed) setRevealed(true);
  }

  function rate() {
    setAnimating(true);
    setRevealed(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % book.cards.length);
      setAnimating(false);
    }, 200);
  }

  return (
    <section className="bg-neutral-950 py-20 sm:py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-white">
            See it <span className="text-amber-400">in action</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-400 max-w-xl mx-auto">
            A clean, focused interface designed for readers who learn.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Book list */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-white font-bold text-sm">📚 Your Books</span>
              <span className="text-xs text-neutral-500">{booksData.length} books</span>
            </div>
            <div className="p-2">
              {booksData.map((b, i) => (
                <button
                  key={i}
                  onClick={() => selectBook(i)}
                  className={cn(
                    'w-full p-3 rounded-lg flex items-center justify-between transition-all duration-200 text-left cursor-pointer',
                    i === activeBook
                      ? 'bg-amber-400/10 border border-amber-400/30'
                      : 'border border-transparent hover:bg-neutral-800'
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        'font-semibold text-sm transition-colors',
                        i === activeBook ? 'text-amber-400' : 'text-white'
                      )}
                    >
                      {b.title}
                    </div>
                    <div className="text-xs text-neutral-500">{b.count} words</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-neutral-600">{b.lang}</span>
                    {i === activeBook && (
                      <div className="text-[10px] text-amber-400/70 mt-0.5">
                        {b.dueCards} due
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard study */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-white font-bold text-sm">🧠 Study Session</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500">
                  {cardIndex + 1}/{book.cards.length}
                </span>
                <span className="text-xs text-amber-400/70">{book.dueCards} cards due</span>
              </div>
            </div>
            <div className="p-6 text-center">
              {/* Card */}
              <div
                onClick={reveal}
                className={cn(
                  'bg-neutral-800 rounded-xl p-8 mb-6 transition-all duration-200 min-h-[220px] flex flex-col justify-center',
                  !revealed && 'cursor-pointer hover:bg-neutral-750 hover:ring-1 hover:ring-amber-400/20',
                  animating && 'opacity-0 scale-95'
                )}
              >
                <div className="text-4xl font-black text-white mb-2">{card.word}</div>
                <div className="text-sm text-neutral-500 font-mono mb-4">{card.pron}</div>

                {revealed ? (
                  <div className="animate-[fadeIn_0.3s_ease-out]">
                    <div className="h-px bg-neutral-700 my-4" />
                    <div className="text-xl text-amber-400 font-semibold">{card.translation}</div>
                    <div className="text-sm text-neutral-400 mt-2 italic">
                      &ldquo;{card.def}&rdquo;
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="text-xs text-neutral-600 border border-neutral-700 rounded-full px-3 py-1">
                      tap to reveal
                    </span>
                  </div>
                )}
              </div>

              {/* Rating buttons */}
              <div
                className={cn(
                  'flex gap-2 justify-center transition-all duration-200',
                  revealed
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                )}
              >
                {ratings.map((r, i) => (
                  <button
                    key={i}
                    onClick={rate}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer',
                      r.color
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
