import Link from "next/link";
import { comparisons } from "@/components/compare/registry";
import { tree as foundationsTree } from "@/components/foundations/registry";
import { tree as coreTree } from "@/components/core/registry";

const linkCx = "underline underline-offset-4 hover:text-primary text-sm";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-3">
        LifeSG / shadcn pilot
      </h1>
      <p className="text-base text-muted-foreground mb-8">
        One-week pilot evaluating whether shadcn/ui (with LifeSG design tokens) can match{" "}
        <code className="font-mono text-sm">@lifesg/react-design-system</code> on visual,
        a11y, and interaction parity.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Component comparisons</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Shadcn build (left) vs LifeSG (right), sharing the same theme tokens.{" "}
          <Link href="/compare" className={linkCx}>Index →</Link>
        </p>
        <ul className="flex flex-col gap-2 pl-1">
          {comparisons.map((c) => (
            <li key={c.slug}>
              <Link href={`/compare/${c.slug}`} className={linkCx}>{c.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Foundations</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Extracted CSS vars (left) vs LifeSG live resolver (right). Mirrors LifeSG&rsquo;s
          Storybook Foundations taxonomy.{" "}
          <Link href="/foundations/introduction" className={linkCx}>Start →</Link>
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {foundationsTree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <div key={node.slug} className="col-span-2">
                  <Link href={`/foundations/${node.slug}`} className={linkCx}>
                    {node.title}
                  </Link>
                </div>
              );
            }
            return (
              <div key={node.slug}>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  {node.title}
                </div>
                <ul className="flex flex-col gap-1">
                  {node.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={`/foundations/${node.slug}/${child.slug}`}
                        className={linkCx}
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Core components</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Our L3-tokened implementation (left) vs LifeSG (right). Mirrors LifeSG&rsquo;s
          Storybook <em>Core</em> taxonomy.{" "}
          <Link href="/core/introduction" className={linkCx}>Start →</Link>
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {coreTree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <div key={node.slug} className="col-span-2">
                  <Link href={`/core/${node.slug}`} className={linkCx}>
                    {node.title}
                  </Link>
                </div>
              );
            }
            return (
              <div key={node.slug}>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  {node.title}
                </div>
                <ul className="flex flex-col gap-1">
                  {node.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={`/core/${node.slug}/${child.slug}`}
                        className={linkCx}
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
