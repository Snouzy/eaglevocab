import { useLocation } from "react-router";
import { Link } from "react-router";
import { BookOpen, Home, Layers, Plus, Settings, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const generalLinks = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
];

const managementLinks = [
  { href: "/decks", icon: Layers, label: "My Decks" },
  { href: "/books", icon: BookOpen, label: "My Books" },
  { href: "/cards/new", icon: Plus, label: "New Card" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  function renderLink(link: { href: string; icon: any; label: string }) {
    const Icon = link.icon;
    const isActive =
      location.pathname === link.href ||
      location.pathname.startsWith(link.href + "/");

    return (
      <Link
        key={link.href}
        to={link.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-3 transition-colors",
          isActive
            ? "bg-sidebar-active-bg text-sidebar-active border-l-[3px] border-sidebar-active"
            : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-white/5"
        )}
      >
        <Icon className="h-5 w-5" />
        {link.label}
      </Link>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-white text-lg"
        >
          <BookOpen className="h-6 w-6" />
          EagleVocab
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-sidebar-muted hover:text-sidebar-foreground hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        <div>
          <p className="px-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            General
          </p>
          <div className="space-y-1">{generalLinks.map(renderLink)}</div>
        </div>

        <div>
          <p className="px-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Management
          </p>
          <div className="space-y-1">{managementLinks.map(renderLink)}</div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
