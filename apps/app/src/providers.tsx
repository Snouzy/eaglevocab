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
              "w-full flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg border text-sm font-medium",
            success:
              "bg-emerald-50 border-emerald-200 text-emerald-800",
            error:
              "bg-red-50 border-red-200 text-red-800",
            info: "bg-blue-50 border-blue-200 text-blue-800",
            warning:
              "bg-amber-50 border-amber-200 text-amber-800",
            default:
              "bg-white border-border text-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
