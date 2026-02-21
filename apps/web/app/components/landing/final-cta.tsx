import { ArrowRight, Bird } from 'lucide-react';

export default function FinalCta() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

  return (
    <section className="bg-amber-400 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Bird className="w-12 h-12 mx-auto mb-6 text-black" />

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-black">
          Ready to never forget<br />
          a word again?
        </h2>

        <p className="mt-6 text-lg text-black/70 max-w-xl mx-auto font-medium">
          Join thousands of readers who turn every book into a language lesson.
        </p>

        <div className="mt-10">
          <a
            href={`${appUrl}/sign-up`}
            className="inline-flex items-center justify-center gap-2 bg-black text-white text-lg font-bold px-10 py-5 rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
          >
            Start Learning Free
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <p className="mt-4 text-sm text-black/50 font-medium">
          Free forever. No credit card required.
        </p>
      </div>
    </section>
  );
}
