import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, X } from "lucide-react";
import { NAV_GROUPS, PAGE_MAP } from "./pages";

/**
 * Left docs sidebar. Collapsible groups, active-page highlight, mobile drawer.
 */
export function DocsSidebar({
  activeSlug,
  mobileOpen,
  onCloseMobile,
}: {
  activeSlug: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const activeGroup = NAV_GROUPS.find((g) => g.slugs.includes(activeSlug))?.group;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map((g) => [g.group, g.group === activeGroup])),
  );

  useEffect(() => {
    if (activeGroup) setOpenGroups((s) => ({ ...s, [activeGroup]: true }));
  }, [activeGroup]);

  const body = (
    <nav className="space-y-4">
      {NAV_GROUPS.map((g) => {
        const open = openGroups[g.group];
        return (
          <div key={g.group}>
            <button
              onClick={() => setOpenGroups((s) => ({ ...s, [g.group]: !s[g.group] }))}
              className="mb-1 flex w-full items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`} />
              {g.group}
            </button>
            {open && (
              <ul className="ml-1 space-y-0.5 border-l border-border/70 pl-3">
                {g.slugs.map((slug) => {
                  const page = PAGE_MAP[slug];
                  const isActive = slug === activeSlug;
                  return (
                    <li key={slug}>
                      <Link
                        to="/docs/$slug"
                        params={{ slug }}
                        onClick={onCloseMobile}
                        className={`relative block rounded-md px-2 py-1 text-[13px] transition-colors ${
                          isActive
                            ? "bg-surface text-foreground"
                            : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute -left-3 top-1/2 h-4 w-px -translate-y-1/2 bg-signal" />
                        )}
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">{body}</div>
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="glass absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto border-r border-border p-5 animate-slide-in-right"
            style={{ animation: "slide-in-right 0.25s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Documentation
              </span>
              <button
                onClick={onCloseMobile}
                className="rounded-md p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
