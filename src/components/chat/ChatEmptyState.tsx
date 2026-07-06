import { motion } from "motion/react";
import { ModelSelector } from "@/components/app/ModelSelector";
import type { OrbitModelId } from "@/lib/openai";
import orbitLogoIcon from "@/assets/orbit-logo-icon.png";

const SUGGESTIONS = [
  { label: "Explain quantum computing", sub: "in simple terms" },
  { label: "Write a Next.js API route", sub: "with error handling" },
  { label: "Summarize this article", sub: "key points only" },
  { label: "Generate a marketing strategy", sub: "for a SaaS product" },
  { label: "Create a Python script", sub: "to parse JSON files" },
  { label: "Debug my React code", sub: "performance issues" },
];

interface ChatEmptyStateProps {
  model: OrbitModelId;
  onModelChange: (m: OrbitModelId) => void;
  onPrompt: (p: string) => void;
  onStartDemo?: () => void;
}

export function ChatEmptyState({
  model,
  onModelChange,
  onPrompt,
  onStartDemo,
}: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center max-w-2xl mx-auto overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="mb-6"
      >
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full bg-signal/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-signal/20" />
          <div className="absolute inset-4 rounded-full bg-background border border-signal/30 flex items-center justify-center shadow-[0_0_20px_rgba(var(--signal-rgb),0.1)]">
            <img src={orbitLogoIcon} alt="0RBIT" className="w-5 h-5 object-contain" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
          What can I help with?
        </h2>
        <p className="text-sm text-muted-foreground max-w-[320px] mx-auto leading-relaxed">
          Powered by 0RBIT's distributed AI network for high-performance inference.
        </p>
      </motion.div>

      {/* Model & Demo */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col items-center gap-4 mb-10 w-full"
      >
        <ModelSelector value={model} onChange={onModelChange} />

        {onStartDemo && (
          <button
            onClick={onStartDemo}
            className="text-xs text-signal/70 hover:text-signal transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-signal/20 bg-signal/5 hover:bg-signal/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
            </span>
            Watch Product Demo
          </button>
        )}
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => onPrompt(s.label + " " + s.sub)}
            className="flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border border-border bg-white/[0.03] hover:bg-white/[0.07] hover:border-border-strong text-left transition-all group"
          >
            <span className="text-sm font-medium text-foreground group-hover:text-signal transition-colors">
              {s.label}
            </span>
            <span className="text-xs text-muted-foreground">{s.sub}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
