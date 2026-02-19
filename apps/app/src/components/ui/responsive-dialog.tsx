import * as React from "react";
import { useIsMobile } from "@/shared/hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function ResponsiveDialog({ children, ...props }: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Dialog;
  return <Root {...props}>{children}</Root>;
}

function ResponsiveDialogTrigger({
  children,
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useIsMobile();
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger;
  return <Trigger {...props}>{children}</Trigger>;
}

function ResponsiveDialogContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent>
        <div className="overflow-y-auto max-h-[85vh] px-4 pb-[calc(env(safe-area-inset-bottom,8px)+1rem)]">
          {children}
        </div>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  );
}

function ResponsiveDialogHeader({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();
  const Header = isMobile ? DrawerHeader : DialogHeader;
  return <Header {...props}>{children}</Header>;
}

function ResponsiveDialogFooter({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();
  const Footer = isMobile ? DrawerFooter : DialogFooter;
  return <Footer {...props}>{children}</Footer>;
}

function ResponsiveDialogTitle({
  children,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const isMobile = useIsMobile();
  const Title = isMobile ? DrawerTitle : DialogTitle;
  return <Title {...props}>{children}</Title>;
}

function ResponsiveDialogDescription({
  children,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const isMobile = useIsMobile();
  const Desc = isMobile ? DrawerDescription : DialogDescription;
  return <Desc {...props}>{children}</Desc>;
}

function ResponsiveDialogClose({
  children,
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  const isMobile = useIsMobile();
  const Close = isMobile ? DrawerClose : DialogClose;
  return <Close {...props}>{children}</Close>;
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
};
