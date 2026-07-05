import { useState } from "react";

type Faq = { q: string; a: string };

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/40">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface"
              aria-expanded={isOpen}
            >
              <span className="font-display text-[15px] font-medium tracking-tight text-foreground">
                {item.q}
              </span>
              <span
                className={`shrink-0 font-mono text-signal transition-transform duration-400 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className="grid transition-all duration-400 ease-[var(--ease-out-soft)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-[14px] leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
