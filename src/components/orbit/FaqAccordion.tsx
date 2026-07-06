import { useState } from "react";
import { Reveal } from "./Reveal";

type Faq = { q: string; a: string };

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Reveal>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/40">
        {items.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          const triggerId = `faq-trigger-${i}`;
          return (
            <div key={item.q}>
              <button
                id={triggerId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                aria-expanded={isOpen}
                aria-controls={panelId}
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
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="grid transition-all duration-400 ease-[var(--ease-out-soft)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-[14px] leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
