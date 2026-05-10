import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-3">
        LifeSG / shadcn pilot
      </h1>
      <p className="text-base text-muted-foreground mb-8">
        One-week pilot evaluating whether shadcn/ui (with LifeSG design tokens) can match{" "}
        <code className="font-mono text-sm">@lifesg/react-design-system</code> on visual,
        a11y, and interaction parity.
      </p>
      <ul className="flex flex-col gap-3">
        <li>
          <Link
            href="/compare"
            className="underline underline-offset-4 hover:text-primary"
          >
            Side-by-side comparisons →
          </Link>
        </li>
      </ul>
    </main>
  );
}
