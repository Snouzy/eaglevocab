import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HelpTooltipProps {
  content: string;
  title?: string;
  side?: "top" | "bottom" | "left" | "right";
}

const isTouchDevice = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export function HelpTooltip({ content, title = "Help", side = "top" }: HelpTooltipProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const triggerClassName =
    "inline-flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors";

  return (
    <>
      {/* Desktop: tooltip on hover */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={triggerClassName}
              onClick={(e) => {
                if (isTouchDevice()) {
                  e.preventDefault();
                  setDialogOpen(true);
                }
              }}
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side={side} className="max-w-[260px] text-sm leading-relaxed hidden sm:block">
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Mobile: dialog on tap */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              {content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
