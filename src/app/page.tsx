import Link from "next/link";
import { comparisons } from "@/components/compare/registry";
import { tree as foundationsTree } from "@/components/foundations/registry";
import { tree as coreTree } from "@/components/core/registry";
import { tree as contentTree } from "@/components/content/registry";
import { tree as overlaysTree } from "@/components/overlays/registry";
import { tree as navigationTree } from "@/components/navigation/registry";
import { tree as selectionAndInputTree } from "@/components/selection-and-input/registry";

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

      <section className="mb-10">
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

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Content components</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Display + light-interaction primitives. First batch in the pilot to test
          behavioural parity (Tab + Accordion).{" "}
          <Link href="/content/introduction" className={linkCx}>Start →</Link>
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {contentTree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <div key={node.slug} className="col-span-2">
                  <Link href={`/content/${node.slug}`} className={linkCx}>
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
                        href={`/content/${node.slug}/${child.slug}`}
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

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Navigation</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Avatar, Breadcrumb, LinkList, Masthead, Pagination, LocalNav, Sidenav,
          skeletal Navbar &amp; Footer.{" "}
          <Link href="/navigation/introduction" className={linkCx}>Start →</Link>
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {navigationTree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <div key={node.slug} className="col-span-2">
                  <Link href={`/navigation/${node.slug}`} className={linkCx}>
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
                        href={`/navigation/${node.slug}/${child.slug}`}
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

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Selection and Input</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Mirrors LifeSG&rsquo;s Storybook <em>Selection and Input</em> taxonomy.{" "}
          <Link href="/selection-and-input/introduction" className={linkCx}>Start →</Link>
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {selectionAndInputTree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <div key={node.slug} className="col-span-2">
                  <Link href={`/selection-and-input/${node.slug}`} className={linkCx}>
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
                        href={`/selection-and-input/${node.slug}/${child.slug}`}
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
        <h2 className="text-lg font-semibold mb-3">Overlays</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Portal-mounted dialogs with focus traps, scroll lock, and backdrop dismissal.{" "}
          <Link href="/overlays/introduction" className={linkCx}>Start →</Link>
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {overlaysTree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <div key={node.slug} className="col-span-2">
                  <Link href={`/overlays/${node.slug}`} className={linkCx}>
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
                        href={`/overlays/${node.slug}/${child.slug}`}
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
