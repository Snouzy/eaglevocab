import { Star } from 'lucide-react';

export default function Testimonials() {
  const stats = [
    { value: '10K+', label: 'Words learned' },
    { value: '50+', label: 'Languages supported' },
    { value: '4.9/5', label: 'User rating' },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'English Teacher',
      text: 'I used to keep word lists in notebooks that I never reviewed. EagleVocab changed everything the spaced repetition actually makes words stick.',
      avatar: 'S',
    },
    {
      name: 'Thomas K.',
      role: 'Avid Reader',
      text: 'Reading Japanese novels went from frustrating to enjoyable. I save words as I read, and the AI translations are surprisingly accurate.',
      avatar: 'T',
    },
    {
      name: 'Maria L.',
      role: 'Language Student',
      text: "The book-based organization is genius. I can see exactly which words I learned from each book. It makes reading feel productive.",
      avatar: 'M',
    },
  ];

  return (
    <section className="bg-amber-50 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-neutral-900">{stat.value}</div>
              <div className="mt-2 text-sm sm:text-base text-neutral-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            What they say <span className="text-highlight">about us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-neutral-700 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-bold text-black text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
