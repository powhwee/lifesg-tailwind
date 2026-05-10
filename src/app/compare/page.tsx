import Link from "next/link";
import { comparisons } from "@/components/compare/registry";

export default function ComparisonsIndex() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold mb-2">Component comparisons</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Each page renders the shadcn-built component on the left and the LifeSG component on the right,
        sharing the same theme tokens. Used for visual + a11y + interaction parity checks.
      </p>
      <ul className="flex flex-col gap-2">
        {comparisons.map((c) => (
          <li key={c.slug}>
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href={`/compare/${c.slug}`}
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
