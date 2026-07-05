import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const cols: { title: string; items: { label: string; to: string }[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Overview", to: "/product" },
      { label: "API", to: "/api" },
      { label: "Console", to: "/developers" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Docs", to: "/developers" },
      { label: "Changelog", to: "/company" },
      { label: "Status", to: "/company" },
      { label: "SDKs", to: "/developers" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/company" },
      { label: "Manifesto", to: "/manifesto" },
      { label: "Careers", to: "/company" },
      { label: "Contact", to: "/company" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
        <div className="col-span-2 space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            The decentralized runtime for AI. Inference at the edge of the network.
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-signal shadow-[0_0_10px] shadow-signal animate-orbit-pulse" />
            All systems operational
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {c.title}
            </div>
            <ul className="space-y-2">
              {c.items.map((i) => (
                <li key={i.label}>
                  <Link
                    to={i.to}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-border px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <div>© 2026 0RBIT Labs. Runtime, not marketing.</div>
        <div className="flex items-center gap-4">
          <span className="font-mono">v1.0.0</span>
          <span className="font-mono">edge · us-west-2</span>
        </div>
      </div>
    </footer>
  );
}
