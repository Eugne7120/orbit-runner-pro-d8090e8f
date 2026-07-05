import { useState } from "react";

type Tab = { label: string; lang?: string; code: string };

/**
 * Premium code block with language tabs, copy button, and syntax hinting.
 * Kept dependency-free — token coloring done via a tiny hand-rolled tokenizer.
 */
export function CodeBlock({
  tabs,
  filename,
  className = "",
}: {
  tabs: Tab[];
  filename?: string;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = tabs[i];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className={`glass overflow-hidden rounded-2xl ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-0.5">
          {tabs.map((t, idx) => (
            <button
              key={t.label}
              onClick={() => setI(idx)}
              className={`rounded-md px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors ${
                idx === i
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {filename && (
            <span className="hidden font-mono text-[10.5px] text-muted-foreground sm:inline">
              {filename}
            </span>
          )}
          <button
            onClick={copy}
            className="rounded-md border border-border bg-surface/60 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground transition-all hover:border-border-strong hover:text-foreground"
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto bg-[oklch(0.13_0.008_250)] p-4 font-mono text-[12.5px] leading-relaxed">
        <code
          className="text-foreground/90"
          dangerouslySetInnerHTML={{ __html: highlight(active.code, active.lang ?? "ts") }}
        />
      </pre>
    </div>
  );
}

/* ----- tiny tokenizer, safe subset ----- */
const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "import", "from", "export",
  "await", "async", "if", "else", "for", "while", "class", "new", "true",
  "false", "null", "undefined", "as", "in", "of", "typeof", "interface",
  "type", "throw", "try", "catch", "def", "print", "self", "None", "True",
  "False", "package", "func", "struct", "impl", "let", "fn", "mut", "use",
  "pub", "match",
]);

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string, _lang: string): string {
  // Order matters. Comments → strings → numbers → keywords → punctuation.
  const parts: { t: "code" | "html"; v: string }[] = [{ t: "code", v: code }];

  const run = (re: RegExp, cls: string) => {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.t !== "code") continue;
      const chunks: typeof parts = [];
      let last = 0;
      p.v.replace(re, (match, ...rest) => {
        const offset = rest[rest.length - 2] as number;
        if (offset > last) chunks.push({ t: "code", v: p.v.slice(last, offset) });
        chunks.push({ t: "html", v: `<span class="${cls}">${escapeHtml(match)}</span>` });
        last = offset + match.length;
        return match;
      });
      if (last < p.v.length) chunks.push({ t: "code", v: p.v.slice(last) });
      if (chunks.length) parts.splice(i, 1, ...chunks), (i += chunks.length - 1);
    }
  };

  run(/\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//g, "text-muted-foreground/70");
  run(/(["'`])(?:\\.|(?!\1).)*\1/g, "text-emerald-300/80");
  run(/\b\d+(?:\.\d+)?\b/g, "text-signal");

  // Keywords need tokenization
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.t !== "code") continue;
    p.v = escapeHtml(p.v).replace(/\b[a-zA-Z_$][\w$]*\b/g, (w) => {
      if (KEYWORDS.has(w)) return `<span class="text-signal/90">${w}</span>`;
      return w;
    });
    p.t = "html";
  }

  return parts.map((p) => p.v).join("");
}
