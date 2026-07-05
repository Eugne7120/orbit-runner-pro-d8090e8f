import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/product", label: "Product" },
  { to: "/api", label: "API" },
  { to: "/docs", label: "Docs" },
  { to: "/developers", label: "Developers" },
  { to: "/workers", label: "Workers" },
  { to: "/runtime", label: "Runtime" },
  { to: "/pricing", label: "Pricing" },
  { to: "/economy", label: "Economy" },
  { to: "/manifesto", label: "Manifesto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500"
      style={{ paddingTop: scrolled ? 10 : 18 }}
    >
      <nav
        aria-label="Main navigation"
        className={`flex w-full max-w-6xl items-center justify-between rounded-full transition-all duration-500 ${
          scrolled
            ? "glass-strong border-border-strong px-4 py-2 shadow-elegant"
            : "border-transparent px-5 py-2.5"
        }`}
        style={{
          borderColor: scrolled ? "var(--color-border-strong)" : "transparent",
        }}
      >
        <Link to="/" className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label="0RBIT — home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/developers"
            className="hidden rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/pricing"
            className="group hidden items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background transition-all hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
          >
            Get access
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          >
            <span className="relative flex h-4 w-4.5 flex-col items-center justify-center">
              <span
                className="absolute h-px w-4.5 bg-current transition-all duration-300 ease-[var(--ease-out-soft)]"
                style={{ transform: open ? "rotate(45deg)" : "translateY(-5px)" }}
              />
              <span
                className="absolute h-px w-4.5 bg-current transition-opacity duration-200"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute h-px w-4.5 bg-current transition-all duration-300 ease-[var(--ease-out-soft)]"
                style={{ transform: open ? "rotate(-45deg)" : "translateY(5px)" }}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 bg-background/98 backdrop-blur-xl transition-opacity duration-300 ease-[var(--ease-out-soft)] md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className={`flex h-full flex-col overflow-y-auto px-6 pb-10 pt-24 transition-all duration-300 ease-[var(--ease-out-soft)] ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="flex flex-1 flex-col justify-center gap-1">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
                className={`rounded-xl px-4 py-4 font-display text-[22px] font-medium tracking-tight text-foreground/85 transition-all duration-300 ease-[var(--ease-out-soft)] hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                activeProps={{ className: "bg-surface text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
            <Link
              to="/developers"
              className="rounded-full border border-border-strong px-4 py-3.5 text-center text-[15px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign in
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-3.5 text-[15px] font-medium text-background transition-all hover:bg-foreground/90"
            >
              Get access
              <span>→</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
