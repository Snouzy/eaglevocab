import { Bird } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <Bird className="w-5 h-5" />
              <span className="font-bold">EagleVocab</span>
            </div>
            <p className="text-sm text-muted-foreground">Built for readers who learn.</p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-4">
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 EagleVocab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
