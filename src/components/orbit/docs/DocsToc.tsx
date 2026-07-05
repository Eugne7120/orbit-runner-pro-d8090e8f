import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PAGES, PAGE_MAP, type DocPage } from "./pages";

/**
 * Right-side "on this page" TOC with scroll spy, plus Prev/Next and Related.
 */
export function DocsToc({ page }: { page: DocPage }) {
  const [activeId, setActiveId] = useState(page.toc[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = page.toc.map((t) => t.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  const idx = PAGES.findIndex((p) => p.slug === page.slug);
  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

  const related = PAGES.filter(
    (p) => p.group === page.group && p.slug !== page.slug,
  ).slice(0, 3);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-32 max-h-[calc(100vh-8rem)] space-y-8 overflow-y-auto pr-1">
        <div>
          <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            On this page
          </div>
          <ul className="space-y-1.5 border-l border-border/70 pl-3">
            {page.toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className={`block text-[12.5px] transition-colors ${
                    activeId === t.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {related.length > 0 && (
          <div>
            <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Related
            </div>
            <ul className="space-y-1.5">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/docs/$slug"
                    params={{ slug: r.slug }}
                    className="block text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          {prev && <PrevNextLink dir="prev" page={prev} />}
          {next && <PrevNextLink dir="next" page={next} />}
        </div>
      </div>
    </aside>
  );
}

function PrevNextLink({ dir, page }: { dir: "prev" | "next"; page: DocPage }) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link
      to="/docs/$slug"
      params={{ slug: page.slug }}
      className="group block rounded-lg border border-border bg-surface/30 p-3 transition-all hover:border-border-strong hover:bg-surface/60"
    >
      <div
        className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground ${
          dir === "next" ? "justify-end" : ""
        }`}
      >
        {dir === "prev" && <Icon className="h-3 w-3" />}
        {dir}
        {dir === "next" && <Icon className="h-3 w-3" />}
      </div>
      <div
        className={`mt-1 text-[13px] text-foreground/90 group-hover:text-foreground ${
          dir === "next" ? "text-right" : ""
        }`}
      >
        {page.title}
      </div>
    </Link>
  );
}

/** Bottom prev/next used inside the main column (mobile-friendly). */
export function BottomPrevNext({ page }: { page: DocPage }) {
  const idx = PAGES.findIndex((p) => p.slug === page.slug);
  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
  if (!prev && !next) return null;
  return (
    <div className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
      <div>{prev && <PrevNextLink dir="prev" page={prev} />}</div>
      <div>{next && <PrevNextLink dir="next" page={next} />}</div>
    </div>
  );
}

export { PAGE_MAP };
