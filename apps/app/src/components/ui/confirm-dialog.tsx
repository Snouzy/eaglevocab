import { useCallback, useRef, useState } from "react";
import { useIsMobile } from "@/shared/hooks/use-media-query";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
}

export function useConfirm(options: ConfirmOptions = {}) {
  const {
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "destructive",
  } = options;

  const [open, setOpen] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const isMobile = useIsMobile();

  const confirm = useCallback(() => {
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const confirmDialog = isMobile ? (
    <Drawer open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pb-[calc(env(safe-area-inset-bottom,8px)+1rem)]">
          <Button variant={variant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, confirmDialog };
}
