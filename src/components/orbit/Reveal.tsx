import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms — use multiples of 80 for cascading card grids */
  delay?: number;
  /** Extra classes applied to the wrapper div (e.g. layout classes) */
  className?: string;
}

/**
 * Scroll-reveal wrapper.
 * Fades in + slides up once when it enters the viewport, then stays visible.
 * Uses IntersectionObserver — no scroll listeners, no repeated triggers.
 * prefers-reduced-motion is handled by the global rule in styles.css.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`orbit-reveal${visible ? " orbit-reveal-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
