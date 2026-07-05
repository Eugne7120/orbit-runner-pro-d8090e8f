export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-medium tracking-tight ${className}`}>
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-foreground/70" />
        <span className="absolute inset-[3px] rounded-full bg-signal/80 blur-[3px]" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-foreground" />
      </span>
      <span className="text-[15px] tracking-[-0.02em]">
        0<span className="text-muted-foreground">R</span>BIT
      </span>
    </span>
  );
}
