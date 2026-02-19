import { useLocation } from "react-router";
import { Link } from "react-router";
import { motion } from "motion/react";
import { BookOpen, CreditCard, Home, Layers, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const links = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/decks", icon: Layers, label: "Decks" },
  { href: "/cards", icon: CreditCard, label: "Cards" },
  { href: "/books", icon: BookOpen, label: "Books" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            location.pathname === link.href ||
            location.pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-5 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium leading-tight">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
