import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
              >
                <span className="relative flex h-3.5 w-4 flex-col justify-between">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong w-[85vw] border-border-strong bg-background/95 sm:max-w-xs">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="mt-6 flex items-center">
                <Logo />
              </div>
              <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="rounded-lg px-3 py-2.5 text-[15px] text-foreground/80 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    activeProps={{ className: "bg-surface text-foreground" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6">
                <Link
                  to="/developers"
                  className="rounded-lg px-3 py-2.5 text-center text-[14px] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign in
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-[14px] font-medium text-background transition-all hover:bg-foreground/90"
                >
                  Get access
                  <span>→</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
