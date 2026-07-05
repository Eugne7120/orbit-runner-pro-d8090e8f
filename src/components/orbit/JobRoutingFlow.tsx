import { useEffect, useState } from "react";

/**
 * Vertical job-routing visualization:
 * User Request → Scheduler → Best Worker → Inference → Streaming Response
 * A signal travels down continuously; each stage glows briefly as it passes.
 */

const STAGES = [
  { id: "request", label: "User Request", hint: "arrives at the edge" },
  { id: "scheduler", label: "Scheduler", hint: "scores latency, load, price" },
  { id: "worker", label: "Best Worker", hint: "selected in <1ms" },
  { id: "inference", label: "Inference", hint: "model executes" },
  { id: "stream", label: "Streaming Response", hint: "tokens return live" },
];

const CYCLE_MS = 5200;

export function JobRoutingFlow() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStage((s) => (s + 1) % STAGES.length);
    }, CYCLE_MS / STAGES.length);
    return () => clearInterval(t);
  }, []);

  const gapPct = 100 / (STAGES.length - 1);

  return (
    <div className="relative mx-auto max-w-md">
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border-strong to-transparent" />
        {/* Traveling signal */}
        <div
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_12px] shadow-signal transition-all ease-[var(--ease-out-soft)]"
          style={{
            top: `${(activeStage / (STAGES.length - 1)) * (100 - (100 * 12) / (STAGES.length * 48))}%`,
            transitionDuration: `${CYCLE_MS / STAGES.length}ms`,
          }}
        />
        <div className="relative flex flex-col gap-8">
          {STAGES.map((s, i) => {
            const isActive = i === activeStage;
            const isPast = i < activeStage;
            return (
              <div key={s.id} className="flex items-center gap-4">
                <div
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-all duration-500 ${
                    isActive
                      ? "border-signal bg-signal/10 text-signal shadow-signal"
                      : isPast
                        ? "border-border-strong bg-surface text-muted-foreground"
                        : "border-border bg-surface/40 text-muted-foreground/60"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-signal/30 animate-orbit-ping" />
                  )}
                  <span className="relative">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="min-w-0">
                  <div
                    className={`font-display text-[15px] font-medium tracking-tight transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">{s.hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
