import { useEffect, useState } from "react";
import { Search, ArrowRight, Hash, Clock, Flame } from "lucide-react";

const RECENT = ["streaming chat completions", "rate limits", "worker selection"];
const POPULAR = [
  { label: "Quickstart", slug: "quickstart" },
  { label: "Chat API reference", slug: "chat" },
  { label: "Server-sent event format", slug: "streaming" },
  { label: "Credits & billing", slug: "credits" },
  { label: "Error envelope", slug: "faq" },
  { label: "SDK — TypeScript", slug: "sdk" },
];

export function DocsSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface/50 px-3 py-2 text-left font-mono text-[11.5px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 truncate">Search docs</span>
        <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] tracking-[0.1em]">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-background/70 px-4 pt-24 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass w-full max-w-xl overflow-hidden rounded-2xl border border-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search 0RBIT docs…"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              <div className="px-3 pb-1 pt-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                <Clock className="mr-1 inline h-3 w-3" /> Recent
              </div>
              {RECENT.map((q) => (
                <button
                  key={q}
                  className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13.5px] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  <Hash className="h-3.5 w-3.5" />
                  <span className="flex-1 truncate">{q}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}

              <div className="px-3 pb-1 pt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                <Flame className="mr-1 inline h-3 w-3" /> Popular
              </div>
              {POPULAR.map((p) => (
                <button
                  key={p.slug}
                  className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13.5px] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  <Hash className="h-3.5 w-3.5" />
                  <span className="flex-1 truncate">{p.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10.5px] text-muted-foreground">
              <span>UI preview · search index not wired</span>
              <span>↵ open</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
