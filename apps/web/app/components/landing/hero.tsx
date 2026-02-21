import { Bird, ArrowRight } from 'lucide-react';

export default function Hero() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

  return (
    <section className="bg-amber-400 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {/* Japanese / Chinese */}
        <div className="absolute top-16 left-[5%] text-[8rem] font-black text-black/[0.04] rotate-[-12deg]">読</div>
        <div className="absolute bottom-24 right-[8%] text-[9rem] font-black text-black/[0.04] rotate-[8deg]">词</div>
        <div className="absolute top-[60%] left-[2%] text-[6rem] font-black text-black/[0.03] rotate-[18deg]">漢</div>
        {/* Korean */}
        <div className="absolute top-28 right-[12%] text-[7rem] font-black text-black/[0.04] rotate-[-8deg]">한</div>
        <div className="absolute bottom-[30%] left-[15%] text-[5rem] font-black text-black/[0.03] rotate-[14deg]">글</div>
        {/* Cyrillic */}
        <div className="absolute top-[45%] right-[3%] text-[7rem] font-black text-black/[0.04] rotate-[5deg]">Щ</div>
        <div className="absolute top-8 left-[35%] text-[5rem] font-black text-black/[0.03] rotate-[-20deg]">Ж</div>
        {/* Romanian */}
        <div className="absolute bottom-12 left-[25%] text-[8rem] font-black text-black/[0.04] rotate-[-6deg]">Ș</div>
        <div className="absolute top-[35%] left-[8%] text-[6rem] font-black text-black/[0.03] rotate-[22deg]">Ț</div>
        <div className="absolute bottom-[15%] right-[20%] text-[7rem] font-black text-black/[0.04] rotate-[-14deg]">Ă</div>
        {/* Arabic / Hebrew */}
        <div className="absolute top-20 right-[30%] text-[7rem] font-black text-black/[0.03] rotate-[12deg]">ع</div>
        <div className="absolute bottom-[40%] right-[5%] text-[6rem] font-black text-black/[0.03] rotate-[-10deg]">ש</div>
        {/* Greek */}
        <div className="absolute bottom-8 right-[35%] text-[6rem] font-black text-black/[0.04] rotate-[16deg]">Ψ</div>
        <div className="absolute top-[55%] left-[30%] text-[5rem] font-black text-black/[0.03] rotate-[-18deg]">Ω</div>
        {/* Thai / Hindi */}
        <div className="absolute top-12 left-[55%] text-[6rem] font-black text-black/[0.03] rotate-[7deg]">ก</div>
        <div className="absolute bottom-[50%] left-[45%] text-[5rem] font-black text-black/[0.03] rotate-[-15deg]">ह</div>
        {/* Accented Latin */}
        <div className="absolute bottom-16 left-[50%] text-[7rem] font-black text-black/[0.04] rotate-[10deg]">É</div>
        <div className="absolute top-[70%] right-[15%] text-[5rem] font-black text-black/[0.03] rotate-[-22deg]">Ñ</div>
        <div className="absolute top-[20%] right-[45%] text-[4rem] font-black text-black/[0.03] rotate-[25deg]">Ü</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-black text-white rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest">
            <Bird className="w-4 h-4" />
            EagleVocab
          </div>

          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.05] uppercase">
            The complete method<br />
            to <span className="bg-white/60 px-2">never forget</span><br />
            a word you read
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-black/75 max-w-2xl mx-auto leading-relaxed font-medium">
            AI-powered translations + spaced repetition flashcards, organized by book.
            Master vocabulary from <strong className="text-black">any language</strong> while reading what you love.
          </p>

          <div className="mt-10">
            <a
              href={`${appUrl}/sign-up`}
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <p className="mt-4 text-sm text-black/50 font-medium">
            Free forever. No credit card required.
          </p>
        </div>

        <div className="mt-14 sm:mt-20 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-black/10 overflow-hidden">
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
              <span className="font-bold text-sm">📖 Les Misérables</span>
              <span className="text-xs font-bold px-3 py-1 bg-amber-400 text-black rounded-full">
                French → English
              </span>
            </div>
            <div className="p-8 text-center">
              <div className="text-5xl sm:text-6xl font-black text-neutral-900 mb-3">papillon</div>
              <div className="text-2xl text-neutral-500 font-semibold mb-3">butterfly</div>
              <div className="text-sm text-neutral-400 font-mono mb-4">/pa.pi.jɔ̃/</div>
              <div className="bg-amber-50 rounded-lg p-3 text-sm text-neutral-600 italic">
                &ldquo;Un papillon bleu dansa dans la lumière du matin.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
