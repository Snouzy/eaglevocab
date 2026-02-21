import { RotateCcw, Clock, X } from 'lucide-react';

export default function Problem() {
  const pains = [
    {
      icon: RotateCcw,
      title: 'You look up the same words over and over',
      description:
        'No system to save them. No context. They vanish from your memory within hours.',
    },
    {
      icon: Clock,
      title: 'You waste time on scattered notes',
      description:
        'Word lists in notebooks, phone apps, sticky notes — nothing is organized or reviewable.',
    },
    {
      icon: X,
      title: "Your vocabulary doesn't grow",
      description:
        "Despite reading daily, you can't recall the words you looked up last week.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            You look up the same word.<br />
            <span className="text-highlight">Again. And again.</span>
          </h2>

          <p className="mt-8 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            You&apos;re reading a great book in a foreign language. You encounter an unknown word.
            You look it up. Two pages later — another one. You look it up too.
          </p>

          <p className="mt-4 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-black">The next day?</strong> You&apos;ve forgotten both.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pains.map((item, i) => (
            <div key={i} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                <item.icon className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl sm:text-2xl font-bold">
            It&apos;s not your memory. <span className="text-highlight">It&apos;s your method.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
