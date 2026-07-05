import { useEffect, useRef, useState } from "react";
import { Zap, TrendingDown, Calendar } from "lucide-react";
import { motion } from "motion/react";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

interface CreditsWidgetProps {
  credits?: number;
  used?: number;
  total?: number;
  className?: string;
}

export function CreditsWidget({
  credits = 120,
  used = 380,
  total = 500,
  className,
}: CreditsWidgetProps) {
  const displayCredits = useCountUp(credits);
  const displayUsed = useCountUp(used);
  const usedPct = Math.round((used / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border border-border bg-surface p-5 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-signal/15 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-signal" />
          </div>
          <span className="text-sm font-medium text-foreground">Credits</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Monthly</span>
      </div>

      {/* Main metric */}
      <div className="mb-4">
        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-semibold text-foreground tabular-nums">{displayCredits.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground mb-1">remaining</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-signal to-orbit"
            initial={{ width: 0 }}
            animate={{ width: `${100 - usedPct}%` }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-muted-foreground">{usedPct}% used</span>
          <span className="text-[11px] text-muted-foreground">{total} total</span>
        </div>
      </div>

      {/* Sub-stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/[0.03] border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Used</span>
          </div>
          <span className="text-sm font-semibold text-foreground tabular-nums">{displayUsed.toLocaleString()}</span>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Resets</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Aug 1</span>
        </div>
      </div>
    </motion.div>
  );
}
