import { createFileRoute, Outlet, useLocation, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { PageShell } from "@/components/orbit/PageShell";
import { PageBackground } from "@/components/orbit/PageBackground";
import { DocsSidebar } from "@/components/orbit/docs/DocsSidebar";
import { DocsSearch } from "@/components/orbit/docs/DocsSearch";
import { PAGE_MAP, PAGES } from "@/components/orbit/docs/pages";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs 0RBIT" },
      {
        name: "description",
        content:
          "The complete reference for the 0RBIT runtime. Quickstart, chat, streaming, workers, credits, SDK.",
      },
      { property: "og:title", content: "Docs 0RBIT" },
      { property: "og:description", content: "The complete reference for the 0RBIT runtime." },
    ],
  }),
  component: DocsLayout,
});

function DocsLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // derive active slug from URL; /docs → intro
  const path = location.pathname.replace(/\/$/, "");
  const slug = path === "/docs" ? "intro" : (path.split("/").pop() ?? "intro");
  const activeSlug = PAGE_MAP[slug] ? slug : "intro";

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <PageShell>
      <PageBackground variant="code" />

      <div className="mx-auto max-w-7xl px-6 pt-4 md:pt-10">
        {/* Top bar: breadcrumb + search + mobile menu */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md border border-border bg-surface/50 p-2 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <Breadcrumbs slug={activeSlug} />
          </div>
          <div className="w-56 max-w-[60vw] sm:w-72">
            <DocsSearch />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pt-6 lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_200px]">
        <DocsSidebar
          activeSlug={activeSlug}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <Outlet />
      </div>
    </PageShell>
  );
}

function Breadcrumbs({ slug }: { slug: string }) {
  const page = PAGE_MAP[slug] ?? PAGES[0];
  return (
    <div className="flex items-center gap-2 truncate font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
      <Link to="/docs" className="hover:text-foreground">
        docs
      </Link>
      <span>/</span>
      <span className="text-muted-foreground/80">{page.group}</span>
      <span>/</span>
      <span className="truncate text-foreground/90">{page.title}</span>
    </div>
  );
}
