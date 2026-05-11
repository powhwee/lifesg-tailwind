import { notFound, redirect } from "next/navigation";
import { allLeafPaths, firstLeafOf, leafByPath } from "@/components/foundations/registry";
import { LifeSGProvider } from "@/components/compare/lifesg-provider";

export function generateStaticParams() {
  return allLeafPaths().map((p) => ({ slug: p.split("/") }));
}

export default async function FoundationPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join("/");

  /* Folder URL with no leaf — redirect to that folder's first child. */
  if (slug.length === 1) {
    const direct = leafByPath.get(path);
    if (!direct) {
      const target = firstLeafOf(slug[0]);
      if (target) redirect(`/foundations/${target}`);
      notFound();
    }
  }

  const entry = leafByPath.get(path);
  if (!entry) notFound();
  const { leaf, breadcrumb } = entry;

  if (leaf.Prose) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-border px-6 py-3 text-xs text-muted-foreground">
          {breadcrumb.join(" / ")}
        </header>
        <leaf.Prose />
      </div>
    );
  }

  if (!leaf.Ours || !leaf.LifeSG) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-2">{leaf.title}</h1>
        <p className="text-sm text-muted-foreground">Not yet ported.</p>
      </div>
    );
  }

  const Ours = leaf.Ours;
  const LifeSG = leaf.LifeSG;
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border px-6 py-3 flex items-baseline gap-3">
        <span className="text-xs text-muted-foreground">{breadcrumb.join(" / ")}</span>
      </header>
      <div className="grid grid-cols-2 flex-1">
        <section
          aria-label="ours (extracted tokens)"
          className="p-8 border-r border-border"
          data-testid="foundation-ours"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
            ours (CSS vars)
          </div>
          <Ours />
        </section>
        <section
          aria-label="LifeSG reference"
          className="p-8"
          data-testid="foundation-lifesg"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
            LifeSG (live resolver)
          </div>
          <LifeSGProvider>
            <LifeSG />
          </LifeSGProvider>
        </section>
      </div>
    </div>
  );
}
