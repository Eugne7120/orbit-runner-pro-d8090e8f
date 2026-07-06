import { useRef, useEffect, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUp, Image, Video, Code2, Search, ChevronUp } from "lucide-react";
import { ORBIT_MODELS, type OrbitModelId } from "@/lib/openai";
import { cn } from "@/lib/utils";
import orbitLogoIcon from "@/assets/orbit-logo-icon.png";

const QUICK_ACTIONS = [
  { label: "Generate image", icon: Image },
  { label: "Write code", icon: Code2 },
  { label: "Research a topic", icon: Search },
  { label: "Explain a concept", icon: Video },
];

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a Next.js API route with error handling",
  "Generate a marketing strategy for a SaaS product",
  "Create a Python script to parse JSON files",
];

interface ChatEmptyStateProps {
  model: OrbitModelId;
  onModelChange: (m: OrbitModelId) => void;
  onPrompt: (p: string) => void;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function ChatEmptyState({
  model,
  onModelChange,
  onPrompt,
  value,
  onChange,
  onSubmit,
}: ChatEmptyStateProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [modelOpen, setModelOpen] = useState(false);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  // Close model dropdown on outside click
  useEffect(() => {
    if (!modelOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-model-picker]")) setModelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modelOpen]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  const selectedModel = ORBIT_MODELS.find((m) => m.id === model) ?? ORBIT_MODELS[1];

  return (
    // overflow-y-auto so content is reachable on small viewports / keyboard-open mobile
    <div className="flex flex-col items-center justify-center min-h-full h-full px-4 py-8 relative overflow-y-auto">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-signal/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[200px] bg-orbit/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative w-12 h-12">
            <div
              className="absolute inset-0 rounded-full bg-signal/10 animate-pulse"
              style={{ animationDuration: "3s" }}
            />
            <div className="absolute inset-1.5 rounded-full bg-signal/20" />
            <div className="absolute inset-3 rounded-full bg-background border border-signal/30 flex items-center justify-center">
              <img src={orbitLogoIcon} alt="0RBIT" className="w-4 h-4 object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Ask me anything
          </h1>
        </motion.div>

        {/* Input bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="w-full"
        >
          <div className="relative w-full rounded-2xl border border-border bg-white/[0.04] hover:border-border-strong focus-within:border-signal/30 transition-colors shadow-lg shadow-black/20">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message 0RBIT..."
              rows={1}
              className="w-full bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground/50 outline-none px-5 pt-4 pb-14 max-h-40 leading-relaxed"
            />

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-border/50">
              {/* Model selector — click-toggled for touch/keyboard accessibility */}
              <div className="relative" data-model-picker>
                <button
                  type="button"
                  onClick={() => setModelOpen((o) => !o)}
                  aria-expanded={modelOpen}
                  aria-haspopup="listbox"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-border hover:border-border-strong hover:bg-white/[0.08] transition-all text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse flex-shrink-0" />
                  {selectedModel.name}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-signal/15 text-signal font-medium">
                    {selectedModel.badge}
                  </span>
                  <ChevronUp
                    className={cn(
                      "w-3 h-3 text-muted-foreground/60 transition-transform",
                      !modelOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Model dropdown */}
                {modelOpen && (
                  <div
                    role="listbox"
                    className="absolute bottom-full left-0 mb-2 w-60 rounded-xl border border-border bg-popover shadow-xl py-1.5 z-50"
                  >
                    {ORBIT_MODELS.map((m) => (
                      <button
                        key={m.id}
                        role="option"
                        aria-selected={model === m.id}
                        onClick={() => {
                          onModelChange(m.id as OrbitModelId);
                          setModelOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-white/[0.05] transition-colors text-left",
                          model === m.id && "bg-white/[0.04]",
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {model === m.id && (
                            <div className="w-1 h-1 rounded-full bg-signal flex-shrink-0" />
                          )}
                          <div className={cn("min-w-0", model !== m.id && "ml-3")}>
                            <p className="text-xs font-medium text-foreground">{m.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {m.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0",
                            m.recommended
                              ? "bg-signal/15 text-signal"
                              : "bg-white/[0.07] text-muted-foreground",
                          )}
                        >
                          {m.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={onSubmit}
                disabled={!value.trim()}
                aria-label="Send message"
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                  value.trim()
                    ? "bg-signal text-background hover:bg-signal/90 shadow-sm"
                    : "bg-white/[0.05] text-muted-foreground/40 cursor-not-allowed",
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => onPrompt(label)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-white/[0.03] hover:bg-white/[0.07] hover:border-border-strong text-xs text-muted-foreground hover:text-foreground transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.35 }}
          className="flex flex-col gap-1.5 w-full"
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPrompt(s)}
              className="text-left px-4 py-2.5 rounded-xl border border-border/50 bg-white/[0.02] hover:bg-white/[0.05] hover:border-border text-xs text-muted-foreground hover:text-foreground transition-all"
            >
              {s}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
