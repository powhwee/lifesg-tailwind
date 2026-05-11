import type { ReactNode } from "react";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="text-sm text-foreground/80 space-y-3">{children}</div>
    </article>
  );
}

export function IntroductionRoot() {
  return (
    <Page title="Foundations">
      <p>
        Mirrors LifeSG&rsquo;s Storybook Foundations taxonomy. Each <em>Default</em> page renders
        our extracted tokens on the left and LifeSG&rsquo;s live token resolver on the right. If
        they match, parity holds.
      </p>
      <h2 className="text-base font-semibold pt-2">Token layers</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Layer 1 — primitives.</strong> Raw scale values like <code>--lifesg-brand-50</code>,
          <code> --lifesg-spacing-4</code>.
        </li>
        <li>
          <strong>Layer 2 — semantic.</strong> Intent-named aliases like <code>--lifesg-bg-primary</code>.
          Re-bound under <code>.dark</code>.
        </li>
        <li>
          <strong>Layer 3 — component.</strong> Per-component aliases like <code>--button-bg-default</code>
          {" "}— see <em>Component tokens</em>.
        </li>
      </ul>
      <p>
        All Layer 1 + 2 tokens are extracted from <code>@lifesg/react-design-system/theme</code> by{" "}
        <code>scripts/extract-lifesg-tokens.mjs</code>. Run <code>npm run extract-tokens</code> after a
        LifeSG version bump.
      </p>
    </Page>
  );
}

export function ThemesIntro() {
  return (
    <Page title="Themes">
      <p>
        LifeSG ships a single brand theme with light/dark variants. We mirror this via two layers in{" "}
        <code>src/app/lifesg-tokens.css</code>: a <code>:root</code> block (light), and a{" "}
        <code>.dark</code> block (dark). Toggle the <code>.dark</code> class on the root element to
        switch.
      </p>
      <p>
        See <em>Dark mode</em> for a live toggle. See <em>Advanced usage</em> for how this differs
        from LifeSG&rsquo;s styled-components ThemeProvider.
      </p>
    </Page>
  );
}

export function ThemesAdvanced() {
  return (
    <Page title="Themes — Advanced usage">
      <p>
        LifeSG&rsquo;s Storybook documents how to wrap a tree in a styled-components{" "}
        <code>ThemeProvider</code> to swap palettes (light/dark, or per-product like LifeSG vs
        BookingSG). Their tokens are functions of <code>theme</code> resolved at render time.
      </p>
      <p>
        Our port uses CSS custom properties instead. Re-theming means changing the values in{" "}
        <code>:root</code> (or adding a class that overrides them) — no provider needed. Trade-off:
        no runtime theme switching keyed off React state without toggling a className.
      </p>
      <p>
        When the agency brand stabilises, the values in <code>lifesg-tokens.css</code> get replaced;
        no component code changes (see <em>Component tokens</em> on Layer-3 indirection).
      </p>
    </Page>
  );
}

export function ColoursIntro() {
  return (
    <Page title="Colours">
      <p>
        Two layers. <strong>Primitives</strong> are the raw 11-stop scales per palette (brand,
        primary, secondary, neutral, success, warning, error, info, plus white/black). They never
        change. <strong>Semantic</strong> tokens (<code>--lifesg-bg-primary</code>,{" "}
        <code>--lifesg-text-disabled</code>, etc.) name an intent and re-bind to different
        primitives under light/dark.
      </p>
      <p>
        See <em>LifeSG</em> for the full swatch grid. LifeSG&rsquo;s Storybook ships 13 product
        palettes (LifeSG, BookingSG, CCube, MyLegacy, etc.) — we mirror only LifeSG since the
        agency this codebase is for has its own brand coming.
      </p>
    </Page>
  );
}

export function FontIntro() {
  return (
    <Page title="Font">
      <p>
        Sizes, weights, line-heights, and letter-spacing for headings, body, and form labels.
        Sourced from <code>Font.Spec</code> in <code>@lifesg/react-design-system/theme</code>.
      </p>
      <p>
        Note: LifeSG&rsquo;s top-level <code>Font</code> export returns styled-components template
        arrays, not raw values. The extract script reads from <code>Font.Spec</code> instead, which
        returns plain strings.
      </p>
    </Page>
  );
}

export function BreakpointIntro() {
  return (
    <Page title="Breakpoint">
      <p>
        7 named ranges: xxs, xs, sm, md, lg, xl, xxl. Each range has a min/max in pixels, plus a
        column count and gutter/margin widths used by the layout grid.
      </p>
      <p>
        These came from LifeSG as raw numbers (e.g. <code>768</code>). The extract script appends{" "}
        <code>px</code> to threshold values so they&rsquo;re drop-in for media queries, but leaves
        column counts unitless.
      </p>
    </Page>
  );
}

export function SpacingIntro() {
  return (
    <Page title="Spacing">
      <p>
        Two scales. <strong>Spacing</strong> (0–72 in 4-pixel steps, then 64/72) is for component
        padding and gaps. <strong>Layout</strong> (xs–xxxl) is for page-level spacing between
        sections.
      </p>
    </Page>
  );
}

export function MotionIntro() {
  return (
    <Page title="Motion">
      <p>
        Six durations (150ms–1000ms) and four easings (default, standard, entrance, exit).
        Composed at use-time, e.g. <code>transition: opacity var(--lifesg-motion-duration-250)
        var(--lifesg-motion-ease-entrance)</code>.
      </p>
    </Page>
  );
}

export function RadiusIntro() {
  return (
    <Page title="Radius">
      <p>
        Six named sizes: <code>none</code>, <code>xs</code>, <code>sm</code>, <code>md</code>,{" "}
        <code>lg</code>, <code>full</code>. Applied via <code>border-radius: var(--lifesg-radius-md)</code>{" "}
        or referenced from a Layer-3 component token.
      </p>
    </Page>
  );
}

export function BorderIntro() {
  return (
    <Page title="Border">
      <p>
        Four widths (0.5px, 1px, 2px, 4px) plus a <code>solid</code> style token. Border colours
        live under <em>Colours</em> as semantic tokens (<code>--lifesg-border</code>,{" "}
        <code>--lifesg-border-primary</code>, etc.).
      </p>
    </Page>
  );
}

export function ComponentTokensIntro() {
  return (
    <Page title="Component tokens">
      <p>
        Layer 3 of our token system. Each design-system component has a sibling{" "}
        <code>&lt;component&gt;-tokens.css</code> declaring per-component tokens that reference
        Layer 2 semantics. Components reference only Layer-3 names in their class strings.
      </p>
      <p>
        Adopted on 2026-05-11 — see <code>working-logs/pilot-findings.md</code>. The pilot has one
        worked example: <code>src/app/button-tokens.css</code>, consumed by{" "}
        <code>src/components/ui/button.tsx</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">Why</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          We&rsquo;re in a brand-development phase. A re-theme without code changes is highly
          likely; Layer 3 lets a designer hand us a token file to paste in.
        </li>
        <li>
          LifeSG&rsquo;s <em>Component tokens</em> Foundations entry maps 1:1 to this approach.
        </li>
        <li>
          Cost is paid by the design-system maintainer (~30 components surface). Feature engineers
          writing pages never see it — JSX is identical to the Layer-2 version.
        </li>
      </ul>
    </Page>
  );
}

export function ShadowIntro() {
  return (
    <Page title="Shadow">
      <p>
        Three blur sizes (xs, sm, md, lg) with subtle/strong intensity variants, plus two focus
        shadows (focus-strong, error-strong). Values are full <code>box-shadow</code> strings using{" "}
        <code>rgba()</code> for colour.
      </p>
    </Page>
  );
}
