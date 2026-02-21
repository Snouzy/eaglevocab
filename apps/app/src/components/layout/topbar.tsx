import { useNavigate } from "react-router";
import { Link } from "react-router";
import { Bird, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/features/auth/lib/auth-client";
import { toast } from "sonner";

export function Topbar() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  async function handleSignOut() {
    try {
      await authClient.signOut();
      toast.success("Signed out");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-lg lg:hidden"
      >
        <Bird className="h-6 w-6 text-primary" />
        <span className="font-extrabold text-foreground tracking-tight">EagleVocab</span>
      </Link>
      <div className="hidden lg:block lg:flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative flex items-center gap-2 h-10 rounded-full bg-neutral-900 text-white text-sm font-bold px-3 cursor-pointer hover:bg-neutral-800 transition-colors">
            <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <span className="hidden lg:inline text-sm pr-1">{session?.user?.name || "User"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {session?.user?.name || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
