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
        Coverage: Typography, Layout, Icon, Divider, ErrorDisplay, Markup, TextList. Each component
        has an <em>Introduction</em> page that documents what we kept and what we deliberately diverged
        on, and a <em>Default</em> page that renders the comparison side-by-side.
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
      <pre className="bg-lifesg-bg-strong p-3 rounded text-xs overflow-x-auto">{`import { Check } from "lucide-react"\nimport { Icon } from "@/components/ui/icon"\n\n<Icon as={Check} tone="success" size="lg" />`}</pre>
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

export function LayoutIntro() {
  return (
    <Page title="Layout">
      <p>
        Four primitives mirror LifeSG&rsquo;s <code>Layout</code> namespace:{" "}
        <code>Section</code>, <code>Container</code>, <code>Content</code>, <code>ColDiv</code>.
        Same prop shapes (<code>type=&quot;flex|flex-column|grid&quot;</code> defaulting to{" "}
        <code>flex</code>, <code>stretch</code>, <code>xxsCols</code>...<code>xxlCols</code> with{" "}
        <code>[start, end)</code> tuple support — end is <strong>exclusive</strong>, matching
        LifeSG: <code>[1, 5]</code> spans cols 1–4) so call sites migrate mechanically. Backed by
        CSS Grid + a small cascade of media queries in <code>src/app/layout-tokens.css</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">Why we kept it (vs. raw Tailwind)</h2>
      <p>
        Tailwind&rsquo;s grid utilities (<code>grid-cols-12</code>, <code>col-span-N</code>) cover
        the same job in fewer characters when you&rsquo;re building from scratch. We still ship a
        LifeSG-shaped wrapper for two reasons:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Migration cost.</strong> Mirroring the API means a LifeSG screen is a search-and-replace
          import swap. Without the wrapper, every <code>&lt;Layout.ColDiv lgCols=...&gt;</code> needs a
          per-call rewrite.
        </li>
        <li>
          <strong>Single source of truth for breakpoints.</strong> The 8-col → 12-col flip at lg-min, the
          margin and gutter step (24→48px, 16→32px), and the 1440px max-width are encoded once in{" "}
          <code>layout-tokens.css</code>. Pages don&rsquo;t need to know.
        </li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Divergences</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>No styled-components <code>ThemeProvider</code> dependency.</strong> LifeSG&rsquo;s
          ColDiv reads <code>theme.maxColumns</code> at render. Ours reads breakpoints from{" "}
          <code>layout-tokens.css</code> directly.
        </li>
        <li>
          <strong>Range typing relaxed.</strong> LifeSG types <code>BreakpointSpan</code> as a literal{" "}
          <code>Range&lt;Max&gt;</code> per breakpoint, so the type system enforces that{" "}
          <code>xxsCols</code> (8 cols max) can&rsquo;t take <code>9</code>. Ours accepts{" "}
          <code>number | [number, number | -1]</code> — runtime-checked, not exhaustively typed.
          Out-of-range values clamp at the CSS layer.
        </li>
      </ul>
    </Page>
  );
}

export function ErrorDisplayIntro() {
  return (
    <Page title="ErrorDisplay">
      <p>
        A centered illustration + title + description + action button, parameterised by{" "}
        <code>type</code>. Mirrors LifeSG&rsquo;s 19 built-in types
        (<code>400</code>...<code>504</code>, <code>maintenance</code>, <code>no-item-found</code>,{" "}
        <code>logout</code>, <code>inactivity</code>, etc.) with the same titles and copy.
      </p>
      <h2 className="text-base font-semibold pt-2">Illustrations — placeholder, two paths</h2>
      <p>
        Illustrations are the one component-shipped raster asset in LifeSG&rsquo;s library
        (<code>assets.life.gov.sg/react-design-system/img/error/&lt;type&gt;.png</code>). Until the
        agency&rsquo;s own illustration set is designed, we proxy LifeSG&rsquo;s CDN as the default for
        every built-in type — visual parity in the comparison, zero asset pipeline today.
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Default</strong>: LifeSG CDN PNG (with <code>@2x</code> / <code>@3x</code> srcset).
          Swap the <code>CDN_BASE</code> constant in <code>error-display.tsx</code> to repoint at the
          agency&rsquo;s bucket once illustrations are ready.
        </li>
        <li>
          <strong>Override</strong>: <code>img={`{{ src, srcSet, width, height, alt }}`}</code>{" "}
          (matches LifeSG&rsquo;s prop shape) — useful for one-off illustrations on a specific page.
        </li>
        <li>
          <strong>Fallback</strong>: <code>img={`{null}`}</code> renders a Lucide-icon-on-disc in the
          type&rsquo;s semantic tone (red for errors, orange for warnings, green for success). Useful
          for storybook/test environments without network access, and a sane offline state.
        </li>
      </ul>
      <p>
        The honest caveat: pointing at <code>assets.life.gov.sg</code> in production for non-LifeSG
        properties is borrowed branding. Treat the CDN default as a pilot-only convenience, not a
        long-term answer. The override and fallback paths exist for the same reason.
      </p>
      <h2 className="text-base font-semibold pt-2">What we kept verbatim</h2>
      <p>
        Default <code>title</code>, default <code>description</code>, and the dynamic{" "}
        <code>renderDescription</code> for <code>maintenance</code> (interpolates{" "}
        <code>dateString</code>) and <code>inactivity</code> (interpolates a minutes/seconds countdown
        from <code>secondsLeft</code>). The <code>actionButton</code> slot maps to our{" "}
        <code>&lt;Button&gt;</code>, so use <code>variant=&quot;secondary&quot;</code> where LifeSG
        uses <code>styleType=&quot;secondary&quot;</code>.
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
