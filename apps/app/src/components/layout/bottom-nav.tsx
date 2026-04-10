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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-[72px] px-2">
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
                "relative flex flex-col items-center justify-center gap-1 min-w-[4rem] py-2 rounded-xl transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
              <span className="text-xs font-semibold leading-tight">
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
