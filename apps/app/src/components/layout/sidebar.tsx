import { useLocation } from "react-router";
import { Link } from "react-router";
import { motion } from "motion/react";
import { BookOpen, Home, Layers, Plus, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const links = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/decks", icon: Layers, label: "My Decks" },
  { href: "/books", icon: BookOpen, label: "My Books" },
  { href: "/cards/new", icon: Plus, label: "New Card" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-[280px] flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-sidebar-foreground text-lg"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          EagleVocab
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
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
                  "relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-3 transition-colors",
                  isActive
                    ? "text-sidebar-active"
                    : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-sidebar-active-bg rounded-lg border-l-[3px] border-sidebar-active"
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
