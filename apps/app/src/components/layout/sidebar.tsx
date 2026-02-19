import { useLocation } from "react-router";
import { Link } from "react-router";
import { BookOpen, Home, Plus, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/decks", icon: BookOpen, label: "My Decks" },
    { href: "/books", icon: BookOpen, label: "My Books" },
    { href: "/cards/new", icon: Plus, label: "New Card" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 border-r border-border bg-background">
      <div className="sticky top-0 h-14 flex items-center px-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <BookOpen className="h-5 w-5" />
          EagleVocab
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
