import { useNavigate } from "react-router";
import { Link } from "react-router";
import { BookOpen, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
    <div className="h-16 bg-card shadow-sm flex items-center justify-between px-6">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 font-bold text-foreground text-lg lg:hidden"
      >
        <BookOpen className="h-6 w-6 text-primary" />
        EagleVocab
      </Link>
      <div className="hidden lg:block lg:flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex items-center gap-2 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium px-3"
          >
            <span className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <span className="hidden lg:inline text-sm">{session?.user?.name || "User"}</span>
          </Button>
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
