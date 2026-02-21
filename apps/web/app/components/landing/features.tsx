import { BookOpen, Languages, FolderOpen, BarChart3 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: BookOpen,
      title: 'Organized by Book',
      description:
        "Every word you save is linked to the book you're reading. Switch between books, keep your vocabulary structured and contextual.",
    },
    {
      icon: Languages,
      title: 'Any Language Pair',
      description:
        'Set your native language once, then learn vocabulary in as many foreign languages as you want. English, French, Japanese, Korean — you name it.',
    },
    {
      icon: FolderOpen,
      title: 'Custom Decks',
      description:
        'Group cards by theme — travel, food, verbs, business — independently from books. Create the study experience you want.',
    },
    {
      icon: BarChart3,
      title: 'Track Your Progress',
      description:
        "See how many words you've mastered, what's due for review, and how your vocabulary grows over time. Data that motivates.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            Everything you need<br />
            <span className="text-highlight">to master vocabulary</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-600 max-w-xl mx-auto">
            From the page to your long-term memory, EagleVocab covers every step.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
