import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocsPageView } from "@/components/orbit/docs/DocsPageView";
import { PAGE_MAP } from "@/components/orbit/docs/pages";

export const Route = createFileRoute("/docs/$slug")({
  loader: ({ params }) => {
    if (!PAGE_MAP[params.slug]) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? PAGE_MAP[loaderData.slug] : null;
    if (!p) {
      return {
        meta: [{ title: "Not found 0RBIT Docs" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${p.title} 0RBIT Docs` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.title} 0RBIT Docs` },
        { property: "og:description", content: p.description },
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorBox,
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useLoaderData();
  return <DocsPageView slug={slug} />;
}

function NotFound() {
  const { slug } = Route.useParams();
  return (
    <main className="min-w-0">
      <h1 className="font-display text-3xl tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        No doc titled{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px]">{slug}</code>.
      </p>
    </main>
  );
}

function ErrorBox({ error }: { error: Error }) {
  return (
    <main className="min-w-0">
      <h1 className="font-display text-2xl">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </main>
  );
}
