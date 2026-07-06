import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const STEPS = [
  { label: "Allocate Worker", delay: 320 },
  { label: "Load Context", delay: 680 },
  { label: "Prepare Runtime", delay: 1050 },
  { label: "Run Inference", delay: null }, // stays active until streaming begins
  { label: "Stream Response", delay: null }, // activated externally
  { label: "Complete", delay: null }, // activated externally
] as const;

type StepState = "pending" | "active" | "done";

interface RuntimePipelineProps {
  /** True while waiting for the first token from the API */
  waiting: boolean;
}

export function RuntimePipeline({ waiting }: RuntimePipelineProps) {
  const [stepStates, setStepStates] = useState<StepState[]>(
    STEPS.map((_, i) => (i === 3 ? "active" : i < 3 ? "pending" : "pending")),
  );

  // Stagger the first three steps to "done" on mount
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      if (step.delay === null) return;
      timers.push(
        setTimeout(() => {
          setStepStates((prev) => {
            const next = [...prev];
            next[i] = "done";
            // Activate next step if it's still pending
            if (i + 1 < next.length && next[i + 1] === "pending") {
              next[i + 1] = "active";
            }
            return next;
          });
        }, step.delay),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex gap-4 px-4 py-6"
    >
      {/* 0RBIT avatar */}
      <div className="w-8 h-8 rounded-xl bg-signal/10 border border-signal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-signal"
        />
      </div>

      {/* Pipeline */}
      <div className="flex flex-col gap-0.5 pt-0.5 min-w-[220px]">
        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-2">
          Runtime Pipeline
        </p>

        {STEPS.map((step, i) => {
          const state = stepStates[i];
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
              className="flex items-center justify-between gap-6"
            >
              {/* Left bullet + label */}
              <div className="flex items-center gap-2">
                <StepBullet state={state} />
                <span
                  className={
                    state === "pending"
                      ? "text-xs text-muted-foreground/35"
                      : state === "active"
                        ? "text-xs text-foreground/80 font-medium"
                        : "text-xs text-muted-foreground/60"
                  }
                >
                  {step.label}
                </span>
              </div>

              {/* Right status */}
              <RightStatus state={state} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function StepBullet({ state }: { state: StepState }) {
  if (state === "pending") {
    return <span className="text-[10px] text-muted-foreground/30 leading-none select-none">○</span>;
  }
  if (state === "active") {
    return (
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[10px] text-signal leading-none select-none"
      >
        ●
      </motion.span>
    );
  }
  return <span className="text-[10px] text-signal/60 leading-none select-none">●</span>;
}

function RightStatus({ state }: { state: StepState }) {
  return (
    <AnimatePresence mode="wait">
      {state === "done" && (
        <motion.span
          key="done"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "backOut" }}
          className="text-[11px] text-signal/70 font-mono leading-none flex-shrink-0"
        >
          ✓
        </motion.span>
      )}
      {state === "active" && (
        <motion.span
          key="active"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] text-signal leading-none flex-shrink-0 select-none"
        >
          ●
        </motion.span>
      )}
      {state === "pending" && (
        <span key="pending" className="text-[10px] text-transparent leading-none select-none">
          ○
        </span>
      )}
    </AnimatePresence>
  );
}
