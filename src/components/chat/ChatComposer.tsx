import { useRef, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import { Send, Square, Paperclip, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORBIT_MODELS, type OrbitModelId } from "@/lib/openai";

const SUGGESTED_PROMPTS = [
  "Explain quantum computing simply",
  "Write a Next.js API route",
  "Summarize the CAP theorem",
  "Generate a marketing strategy",
  "Create a Python web scraper",
];

interface ChatComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
  isEmpty?: boolean;
  model: OrbitModelId;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  isEmpty,
  model,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectedModel = ORBIT_MODELS.find((m) => m.id === model) ?? ORBIT_MODELS[1];

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isStreaming) onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Suggested prompts — show when empty */}
      {isEmpty && (
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { onChange(p); textareaRef.current?.focus(); }}
              className="px-3 py-1.5 text-xs rounded-full border border-border bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.07] hover:border-border-strong transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Composer box */}
      <div className="relative rounded-2xl border border-border bg-surface focus-within:border-signal/40 focus-within:ring-1 focus-within:ring-signal/20 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Message 0RBIT…"
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        />

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-2.5">
          {/* Left: attachment + model indicator */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-white/[0.05] transition-colors" title="Attach file (coming soon)">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
              <Zap className="w-3 h-3" />
              <span>{selectedModel.name}</span>
            </div>
          </div>

          {/* Right: send / stop */}
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.08] border border-border text-foreground hover:bg-white/[0.12] transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={!value.trim()}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                value.trim()
                  ? "bg-signal text-background hover:bg-signal/90 shadow-md"
                  : "bg-white/[0.05] text-muted-foreground/40 cursor-not-allowed"
              )}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-[11px] text-muted-foreground/40">0RBIT can make mistakes. Verify important information.</p>
    </div>
  );
}
