import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { ORBIT_MODELS, type OrbitModelId } from "@/lib/openai";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: OrbitModelId;
  onChange: (id: OrbitModelId) => void;
  compact?: boolean;
}

export function ModelSelector({ value, onChange, compact }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = ORBIT_MODELS.find((m) => m.id === value) ?? ORBIT_MODELS[1];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-sm text-foreground",
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        )}
      >
        <span className="font-medium">{selected.name}</span>
        {!compact && (
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-medium",
            selected.recommended ? "bg-signal/15 text-signal" : "bg-white/[0.07] text-muted-foreground"
          )}>
            {selected.badge}
          </span>
        )}
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-border bg-popover shadow-xl z-50 py-1.5 overflow-hidden"
          >
            {ORBIT_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => { onChange(model.id as OrbitModelId); setOpen(false); }}
                className={cn(
                  "w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-white/[0.05] transition-colors text-left",
                  value === model.id && "bg-white/[0.04]"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{model.name}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      model.recommended ? "bg-signal/15 text-signal" : "bg-white/[0.07] text-muted-foreground"
                    )}>
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
                </div>
                {value === model.id && <Check className="w-3.5 h-3.5 text-signal mt-0.5 flex-shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
