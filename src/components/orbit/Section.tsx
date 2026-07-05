import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  eyebrow,
  title,
  intro,
  children,
  className = "",
  id,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32 ${className}`}>
      {(eyebrow || title || intro) && (
        <Reveal className="mb-14 max-w-3xl">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px w-6 bg-border-strong" />
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="text-balance font-display text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
              {title}
            </h2>
          )}
          {intro && (
            <p className="mt-5 max-w-2xl text-pretty text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
              {intro}
            </p>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}
