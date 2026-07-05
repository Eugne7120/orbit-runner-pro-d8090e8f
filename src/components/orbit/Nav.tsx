import { Link } from "@tanstack/react-router";
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
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500"
      style={{ paddingTop: scrolled ? 10 : 18 }}
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full transition-all duration-500 ${
          scrolled
            ? "glass-strong border-border-strong px-4 py-2 shadow-elegant"
            : "border-transparent px-5 py-2.5"
        }`}
        style={{
          borderColor: scrolled ? "var(--color-border-strong)" : "transparent",
        }}
      >
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/developers"
            className="hidden rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/pricing"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background transition-all hover:bg-foreground/90"
          >
            Get access
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
