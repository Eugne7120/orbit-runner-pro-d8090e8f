import { useEffect, useState } from "react";

/**
 * Horizontal reward-distribution timeline. A progress indicator sweeps
 * across the stages on a fixed loop, highlighting whichever stage is
 * "current" — purely illustrative, not wall-clock accurate.
 */

const STAGES = [
  { id: "t0", label: "00:00 UTC", sub: "cycle begins" },
  { id: "treasury", label: "Treasury Update", sub: "revenue tallied" },
  { id: "buyback", label: "Buyback", sub: "market order placed" },
  { id: "burn", label: "Burn", sub: "tokens destroyed" },
  { id: "distribute", label: "Reward Distribution", sub: "USDC sent to stakers" },
  { id: "refresh", label: "Staking Refresh", sub: "balances updated" },
];

const CYCLE_MS = 9000;

export function RewardTimeline() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - start) % CYCLE_MS;
      setProgress(elapsed / CYCLE_MS);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeIdx = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-px bg-border-strong" />
        <div
          className="absolute left-0 top-5 h-px bg-signal transition-none"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_12px] shadow-signal"
          style={{ left: `${progress * 100}%`, transform: "translate(-50%, -50%)" }}
        />
        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {STAGES.map((s, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <div key={s.id} className="flex flex-col items-center pt-10 text-center">
                <div
                  className={`absolute top-5 h-2 w-2 -translate-y-1/2 rounded-full transition-colors duration-500`}
                  style={{
                    left: `${(i / (STAGES.length - 1)) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    background: isPast || isActive ? "oklch(0.78 0.14 232)" : "oklch(1 0 0 / 0.16)",
                  }}
                />
                <div
                  className={`font-mono text-[11.5px] font-medium transition-colors duration-500 ${
                    isActive ? "text-signal" : "text-foreground/80"
                  }`}
                >
                  {s.label}
                </div>
                <div className="mt-1 text-[11.5px] text-muted-foreground">{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
