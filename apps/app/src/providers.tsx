import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "w-full flex items-center gap-3 rounded-xl px-5 py-4 shadow-lg border-2 text-base font-medium [&_[data-icon]]:w-5 [&_[data-icon]]:h-5 [&_[data-icon]]:shrink-0",
            success:
              "bg-emerald-50 border-success text-emerald-800 [&_[data-icon]]:text-success",
            error:
              "bg-red-50 border-destructive text-red-800 [&_[data-icon]]:text-destructive",
            info: "bg-blue-50 border-primary text-blue-800 [&_[data-icon]]:text-primary",
            warning:
              "bg-amber-50 border-amber-400 text-amber-800 [&_[data-icon]]:text-amber-500",
            default:
              "bg-white border-border text-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
