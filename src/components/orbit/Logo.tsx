import orbitLogoIcon from "@/assets/orbit-logo-icon.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display font-medium tracking-tight ${className}`}
    >
      <img src={orbitLogoIcon} alt="" className="h-5 w-5" />
      <span className="text-[15px] tracking-[-0.02em]">
        0<span className="text-muted-foreground">R</span>BIT
      </span>
    </span>
  );
}
