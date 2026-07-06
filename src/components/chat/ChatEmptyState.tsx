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
}

export function ChatEmptyState({ model, onModelChange, onPrompt }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="mb-6"
      >
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full bg-signal/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-signal/20" />
          <div className="absolute inset-4 rounded-full bg-background border border-signal/30" />
          <img
            src={orbitLogoIcon}
            alt="0RBIT"
            className="absolute inset-0 m-auto w-5 h-5 object-contain"
          />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1">What can I help with?</h2>
        <p className="text-sm text-muted-foreground">Powered by 0RBIT's distributed AI network.</p>
      </motion.div>

      {/* Model selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8"
      >
        <ModelSelector value={model} onChange={onModelChange} />
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
