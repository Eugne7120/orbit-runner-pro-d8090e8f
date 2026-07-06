import { useEffect, useRef, useState } from "react";

/**
 * A terminal that "writes" real code line-by-line no cursor, no fake glitch.
 * Starts empty, types with human-ish jitter, holds, wipes, repeats.
 */
type Props = {
  title?: string;
  language?: string;
  snippets: string[];
  className?: string;
  height?: number;
};

export function TypingTerminal({
  title = "terminal",
  language,
  snippets,
  className = "",
  height = 220,
}: Props) {
  const [text, setText] = useState("");
  const idx = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.current.push(t);
    };

    const type = (target: string, i = 0) => {
      if (cancelled) return;
      if (i > target.length) {
        // hold, then wipe
        schedule(() => wipe(target), 2200);
        return;
      }
      setText(target.slice(0, i));
      // baseline speed + jitter, pause at newlines, faster on spaces
      const ch = target[i - 1] ?? "";
      let delay = 22 + Math.random() * 32;
      if (ch === "\n") delay = 180 + Math.random() * 120;
      else if (ch === " ") delay = 14 + Math.random() * 18;
      else if (ch === "{" || ch === "(" || ch === ";") delay += 60;
      schedule(() => type(target, i + 1), delay);
    };

    const wipe = (target: string, i = target.length) => {
      if (cancelled) return;
      if (i <= 0) {
        idx.current = (idx.current + 1) % snippets.length;
        schedule(() => type(snippets[idx.current]), 500);
        return;
      }
      setText(target.slice(0, i - 1));
      schedule(() => wipe(target, i - 1), 6 + Math.random() * 10);
    };

    // initial delay so it feels intentional
    schedule(() => type(snippets[idx.current]), 400);

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [snippets]);

  return (
    <div className={`glass overflow-hidden rounded-2xl ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </span>
        </div>
        {language && (
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            {language}
          </span>
        )}
      </div>
      <pre
        className="overflow-hidden bg-[oklch(0.13_0.008_250)] p-4 font-mono text-[12.5px] leading-relaxed text-foreground/90"
        style={{ height, whiteSpace: "pre-wrap" }}
      >
        {text}
      </pre>
    </div>
  );
}
