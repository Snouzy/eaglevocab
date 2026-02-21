'use client';

import { useState, useEffect } from 'react';
import { Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-200',
        isScrolled
          ? 'bg-background backdrop-blur-sm border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bird className="w-6 h-6" />
          <span className="font-bold text-lg">EagleVocab</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="sm">
            <a href={`${appUrl}/sign-in`}>Sign In</a>
          </Button>
          <Button asChild size="sm">
            <a href={`${appUrl}/sign-up`}>Get Started</a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
