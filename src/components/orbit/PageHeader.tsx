export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-14 pt-10">
      <div className="max-w-3xl animate-orbit-fade-up">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px] shadow-signal" />
          {eyebrow}
        </div>
        <h1 className="text-balance font-display text-5xl font-medium tracking-[-0.035em] text-foreground md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">
          {intro}
        </p>
      </div>
      <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-border-strong to-transparent" />
    </section>
  );
}
