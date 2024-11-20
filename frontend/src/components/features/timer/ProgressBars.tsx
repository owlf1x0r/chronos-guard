import { motion } from 'motion/react';

interface ProgressBarsProps {
  totalBars: number;
  activeBars: number;
  color: string;
}

export function ProgressBars({ totalBars, activeBars, color }: ProgressBarsProps) {
  return (
    <div className="flex justify-between w-full h-5 gap-0.5 overflow-hidden">
      {Array.from({ length: totalBars }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-full h-full ${color}`}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: index < activeBars ? 1 : 0.2 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  );
}
