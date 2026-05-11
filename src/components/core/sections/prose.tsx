import type { ReactNode } from "react";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="text-sm text-foreground/80 space-y-3">{children}</div>
    </article>
  );
}

export function CoreIntro() {
  return (
    <Page title="Core">
      <p>
        Mirrors LifeSG&rsquo;s Storybook <em>Core</em> taxonomy. Each <em>Default</em> page renders our
        L3-tokened implementation on the left and the equivalent LifeSG component on the right.
      </p>
      <p>
        Coverage for this batch: Typography, Divider, Icon, Markup, TextList. Layout and ErrorDisplay
        are deferred — see <code>working-logs/pilot-findings.md</code>.
      </p>
    </Page>
  );
}

export function TypographyIntro() {
  return (
    <Page title="Typography">
      <p>
        Six headings (XXL–XS), four body sizes (BL/MD/SM/XS), and four weights, all driven by the L3
        tokens in <code>src/app/typography-tokens.css</code>. Each L3 token redirects to a Layer-2
        font-* variable from the extracted LifeSG theme.
      </p>
      <p>
        We diverge from LifeSG in two places. First, we ship a <em>single</em> <code>Typography</code>{" "}
        component keyed by a <code>variant</code> prop, rather than LifeSG&rsquo;s namespaced{" "}
        <code>Typography.HeadingXXL</code> / <code>Typography.BodyMD</code> exports. Second, the
        polymorphic <code>as</code> prop lets a caller render a visual <code>HeadingMD</code> as an{" "}
        <code>&lt;h2&gt;</code> element — useful for keeping semantic heading order without losing the
        visual scale.
      </p>
    </Page>
  );
}

export function DividerIntro() {
  return (
    <Page title="Divider">
      <p>
        A styled <code>&lt;hr&gt;</code>. Accepts <code>thickness</code> (px), <code>lineStyle</code>{" "}
        (<code>solid | dashed</code>), and <code>color</code>. Defaults flow from the L3 tokens.
      </p>
      <h2 className="text-base font-semibold pt-2">Divergence from LifeSG</h2>
      <p>
        LifeSG&rsquo;s <code>Divider</code> extends <code>ColProps</code>: it can span responsive grid
        columns via <code>xxsCols</code> / <code>xsCols</code> / ... / <code>desktopCols</code> and
        switch between <code>layoutType=&quot;flex&quot;</code> and{" "}
        <code>layoutType=&quot;grid&quot;</code>. We deliberately dropped these.
      </p>
      <p>
        Our Divider stays layout-agnostic — span columns by placing it inside a grid cell and using
        Tailwind&rsquo;s grid utilities (<code>className=&quot;col-span-2&quot;</code> etc.). The cost:
        a migration from LifeSG&rsquo;s Divider that used <code>lgCols</code> et al. needs to move that
        responsibility to the parent. The benefit: Divider has one job, the grid system isn&rsquo;t
        baked into a leaf component.
      </p>
    </Page>
  );
}

export function IconIntro() {
  return (
    <Page title="Icon">
      <p>
        Wraps a <code>lucide-react</code> icon component (or any{" "}
        <code>ComponentType&lt;SVGProps&gt;</code>) with tone + size variants. Pass the icon as the{" "}
        <code>as</code> prop:
      </p>
      <pre className="bg-[var(--lifesg-bg-strong)] p-3 rounded text-xs overflow-x-auto">{`import { Check } from "lucide-react"\nimport { Icon } from "@/components/ui/icon"\n\n<Icon as={Check} tone="success" size="lg" />`}</pre>
      <h2 className="text-base font-semibold pt-2">Library choice</h2>
      <p>
        We use <strong>lucide-react</strong> (~1300 icons) instead of LifeSG&rsquo;s{" "}
        <code>@lifesg/react-icons</code> (~233 icons). Two reasons:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Coverage.</strong> Lucide&rsquo;s catalogue is ~5× larger; we&rsquo;ve hit gaps in
          the LifeSG set before and had to ship custom SVGs.
        </li>
        <li>
          <strong>Convention.</strong> shadcn examples in the wild assume Lucide. Following that
          convention means component code stays copy-pasteable from upstream docs.
        </li>
      </ul>
      <p>
        Trade-off: visual style differs slightly (Lucide is Feather-derived, slightly thinner strokes
        than LifeSG&rsquo;s icons). For known LifeSG screens being migrated 1:1 you can use{" "}
        <code>@lifesg/react-icons</code> directly — <code>&lt;Icon&gt;</code> accepts any{" "}
        <code>SVGProps&lt;SVGSVGElement&gt;</code> component.
      </p>
    </Page>
  );
}

export function MarkupIntro() {
  return (
    <Page title="Markup">
      <p>
        Styles CMS-authored HTML using the design-system typography scale. Mirrors LifeSG&rsquo;s{" "}
        <code>Markup</code> shape: <code>baseTextSize</code> (<code>bl | md | sm | xs</code>),{" "}
        <code>baseTextColor</code>, <code>inline</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">Why not @tailwindcss/typography</h2>
      <p>
        Tailwind&rsquo;s <code>prose</code> plugin is the obvious alternative. We hand-rolled instead:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <code>prose</code>&rsquo;s defaults aren&rsquo;t keyed off the LifeSG scale — every
          <code> --tw-prose-*</code> would need to be re-bound to our tokens.
        </li>
        <li>
          It doesn&rsquo;t expose a single &ldquo;set the body baseline&rdquo; knob, which is exactly
          LifeSG&rsquo;s <code>baseTextSize</code> contract.
        </li>
        <li>
          Adding the plugin is a third opinion to keep aligned (ours + LifeSG&rsquo;s + Tailwind&rsquo;s).
        </li>
      </ul>
      <p>
        The Markup CSS lives in <code>src/app/markup-tokens.css</code> — under 60 lines.
      </p>
    </Page>
  );
}

export function TextListIntro() {
  return (
    <Page title="TextList" >
      <p>
        Two components: <code>UnorderedList</code> and <code>OrderedList</code>. Match LifeSG&rsquo;s
        prop shape: <code>size</code>, <code>bulletType</code>, <code>counterType</code>,{" "}
        <code>counterSeparator</code>, <code>reversed</code>, <code>start</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">Native vs. manual rendering</h2>
      <p>
        Native browser <code>list-style</code> covers the common cases:{" "}
        <code>disc</code>/<code>circle</code>/<code>square</code> for unordered;{" "}
        <code>decimal</code>/<code>lower-alpha</code>/<code>lower-roman</code> with a default{" "}
        <code>.</code> separator for ordered. We fall back to manual counter rendering only when:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <code>bulletType</code> is a custom <code>React.ReactNode</code> (e.g. an icon-as-bullet) — we
          render the bullet as a flex sibling.
        </li>
        <li>
          <code>counterSeparator</code> is anything other than <code>.</code>, or{" "}
          <code>reversed</code> is set — we render numbers directly into <code>&lt;li&gt;</code>{" "}
          contents with the right separator.
        </li>
      </ul>
    </Page>
  );
}
