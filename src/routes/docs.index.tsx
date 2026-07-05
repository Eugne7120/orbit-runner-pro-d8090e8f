import { createFileRoute } from "@tanstack/react-router";
import { DocsPageView } from "@/components/orbit/docs/DocsPageView";
import { PAGE_MAP } from "@/components/orbit/docs/pages";

export const Route = createFileRoute("/docs/")({
  head: () => {
    const p = PAGE_MAP.intro;
    return {
      meta: [
        { title: `${p.title} — 0RBIT Docs` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.title} — 0RBIT Docs` },
        { property: "og:description", content: p.description },
      ],
    };
  },
  component: () => <DocsPageView slug="intro" />,
});
