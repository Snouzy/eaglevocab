'use client';

import { useState, useEffect } from 'react';
import { Bird } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Bird className="w-6 h-6" />
          <span className="font-extrabold text-lg tracking-tight">EagleVocab</span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href={`${appUrl}/sign-in`}
            className="text-sm font-semibold hover:underline hidden sm:block"
          >
            Sign In
          </a>
          <a
            href={`${appUrl}/sign-up`}
            className="bg-neutral-900 text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
