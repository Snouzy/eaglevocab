import { Bird } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <Bird className="w-5 h-5 text-amber-400" />
              <span className="font-extrabold">EagleVocab</span>
            </div>
            <p className="text-sm text-neutral-500">Built for readers who learn.</p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-4">
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-sm text-neutral-600">© 2025 EagleVocab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
