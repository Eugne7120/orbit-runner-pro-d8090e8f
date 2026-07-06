import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Cpu } from "lucide-react";
import type { RuntimeSummaryData } from "@/lib/runtime-metrics";

export function RuntimeSummary({ data }: { data: RuntimeSummaryData }) {
  const [open, setOpen] = useState(true);

  const rows: Array<[string, string]> = [
    ["Worker", data.workerLabel],
    ["Region", data.region],
    ["Latency", `${data.latencyMs} ms`],
    ["First Token", `${data.firstTokenMs} ms`],
    ["Streaming", `${data.tokPerSec} tok/s`],
    ["Completion", `${data.completionSec.toFixed(1)} s`],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="mt-1 ml-12 max-w-sm pb-2"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
      >
        <Cpu className="w-3 h-3" />
        Runtime Summary
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-border bg-white/[0.03] px-3.5 py-2.5 grid grid-cols-2 gap-x-5 gap-y-1.5">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground/45 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="text-[11px] font-mono text-foreground/75">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
