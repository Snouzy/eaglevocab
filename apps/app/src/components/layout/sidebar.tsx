import { useLocation } from "react-router";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Bird, CreditCard, Home, Layers, BookOpen, Plus, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const links = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/decks", icon: Layers, label: "My Decks" },
  { href: "/cards", icon: CreditCard, label: "My Cards" },
  { href: "/books", icon: BookOpen, label: "My Books" },
  { href: "/cards/new", icon: Plus, label: "New Card" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function getIsActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (!pathname.startsWith(href + "/")) return false;
  const moreSpecific = links.some(
    (other) =>
      other.href !== href &&
      other.href.startsWith(href + "/") &&
      (pathname === other.href || pathname.startsWith(other.href + "/"))
  );
  return !moreSpecific;
}

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-[260px] flex-col h-full bg-card border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-lg"
        >
          <Bird className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">EagleVocab</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = getIsActive(location.pathname, link.href);

            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl mx-3 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
