import { useEffect } from "react";
import { PAGE_MAP } from "./pages";
import { DocsToc, BottomPrevNext } from "./DocsToc";

/**
 * Renders a documentation page body (heading, content, TOC, prev/next).
 * Fade-in on mount for a subtle content reveal.
 */
export function DocsPageView({ slug }: { slug: string }) {
  const page = PAGE_MAP[slug];

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!page) return null;

  return (
    <>
      <main key={slug} className="min-w-0 animate-fade-in">
        <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {page.kicker}
        </div>
        <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
          {page.description}
        </p>

        <div className="mt-10">{page.render()}</div>

        <BottomPrevNext page={page} />
      </main>

      <DocsToc page={page} />
    </>
  );
}
