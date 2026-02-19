import { ReactNode } from "react";
import { Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "@/features/auth/lib/auth-client";
import { BookOpen } from "lucide-react";

function LoadingScreen() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-primary/5 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 }}
      >
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute -inset-2 bg-primary/15 rounded-2xl blur-xl pointer-events-none"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative bg-primary/10 p-4 rounded-2xl">
            <BookOpen className="h-9 w-9 text-primary" />
          </div>
        </motion.div>

        <motion.p
          className="text-lg font-bold tracking-tight text-foreground"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          EagleVocab
        </motion.p>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary/50"
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.13,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  if (!isPending && !session) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      {isPending ? (
        <LoadingScreen />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
