import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
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
    <div className="h-14 border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">EagleVocab</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
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
