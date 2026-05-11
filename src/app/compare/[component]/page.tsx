import { notFound } from "next/navigation";
import Link from "next/link";
import { comparisonBySlug, comparisons } from "@/components/compare/registry";
import { LifeSGProvider } from "@/components/compare/lifesg-provider";

export function generateStaticParams() {
  return comparisons.map((c) => ({ component: c.slug }));
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ component: string }>;
}) {
  const { component } = await params;
  const entry = comparisonBySlug.get(component);
  if (!entry) notFound();
  const { title, Shadcn, LifeSG } = entry;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center gap-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Pilot home
        </Link>
        <Link href="/compare" className="text-sm text-muted-foreground hover:text-primary">
          All comparisons
        </Link>
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>

      <div className="grid grid-cols-2 flex-1">
        <section
          aria-label="shadcn implementation"
          className="p-8 border-r border-border"
          data-testid="compare-shadcn"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
            shadcn (ours)
          </div>
          <Shadcn />
        </section>

        <section
          aria-label="LifeSG implementation"
          className="p-8"
          data-testid="compare-lifesg"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
            LifeSG (reference)
          </div>
          <LifeSGProvider>
            <LifeSG />
          </LifeSGProvider>
        </section>
      </div>
    </main>
  );
}
