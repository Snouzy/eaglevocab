import { motion } from "motion/react";

interface StudyProgressProps {
  current: number;
  total: number;
}

export function StudyProgress({ current, total }: StudyProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-muted-foreground mb-1">
        <span>{current} / {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
