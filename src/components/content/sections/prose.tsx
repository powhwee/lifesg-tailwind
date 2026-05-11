import type { ReactNode } from "react";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="text-sm text-foreground/80 space-y-3">{children}</div>
    </article>
  );
}

export function ContentIntro() {
  return (
    <Page title="Content">
      <p>
        Mirrors LifeSG&rsquo;s Storybook <em>Content</em> taxonomy &mdash; the read-only display
        primitives plus one tabbed switcher. Each <em>Default</em> page renders our L3-tokened
        implementation on the left and the equivalent LifeSG component on the right.
      </p>
      <p>
        Coverage in this batch: Card, Table, UneditableSection, BoxContainer, Tab, Accordion. Two
        deferred &mdash; see notes on each. Pilot signal: Tab and Accordion are the first two
        components in the pilot that exercise <em>behavioural</em> parity (focus, ARIA disclosure,
        keyboard nav) rather than purely visual parity.
      </p>
    </Page>
  );
}

export function CardIntro() {
  return (
    <Page title="Card">
      <p>
        LifeSG&rsquo;s <code>Card</code> is a thin styled <code>&lt;div&gt;</code> &mdash; effectively
        a panel with the design system&rsquo;s elevation, radius, and padding. We mirror its shape
        as a passthrough <code>HTMLAttributes&lt;HTMLDivElement&gt;</code> wrapper backed by L3
        tokens in <code>src/app/card-tokens.css</code>.
      </p>
      <p>
        We add three optional sub-components <code>Card.Header</code> / <code>Card.Body</code> /
        <code>Card.Footer</code> as styling conveniences. LifeSG doesn&rsquo;t ship these and you
        can ignore them &mdash; passing arbitrary children to <code>&lt;Card&gt;</code> keeps the
        contract identical to LifeSG&rsquo;s.
      </p>
    </Page>
  );
}

export function TableIntro() {
  return (
    <Page title="Table">
      <p>
        Semantic HTML table primitives, lightly styled. Mirrors LifeSG&rsquo;s namespaced shape
        verbatim: <code>Table.Container</code>, <code>Table.Head</code>, <code>Table.Body</code>,
        <code>Table.Row</code>, <code>Table.Cell</code>, <code>Table.HeaderCell</code>. JSX migrates
        with a single import swap.
      </p>
      <p>
        No sorting, selection, or pagination &mdash; that&rsquo;s <code>DataTable</code> territory.
        This component renders a plain accessible table with LifeSG&rsquo;s row/cell padding,
        border, and header weight.
      </p>
    </Page>
  );
}

export function UneditableSectionIntro() {
  return (
    <Page title="UneditableSection">
      <p>
        A label/value display block, typically used to show submitted form data back to the user
        in a read-only state. Same surface as LifeSG: <code>items</code>, <code>title</code>,
        <code>description</code>, optional <code>topSection</code> / <code>bottomSection</code>,
        <code>background</code>, <code>stretch</code>, <code>fullWidth</code>.
      </p>
      <p>
        <strong>What we deferred</strong>: masking. LifeSG ships per-item{" "}
        <code>maskState</code> / <code>maskLoadingState</code> / <code>maskRange</code> /{" "}
        <code>maskRegex</code> with mask-toggle buttons and a loading/fail flow. We left those
        props off the surface for the pilot &mdash; they&rsquo;re a separate sub-feature that needs
        its own design pass. Items still accept <code>label</code> + <code>value</code> +{" "}
        <code>displayWidth</code> + an optional <code>alert</code>.
      </p>
    </Page>
  );
}

export function BoxContainerIntro() {
  return (
    <Page title="BoxContainer">
      <p>
        A bordered, titled panel that optionally collapses. Mirrors LifeSG&rsquo;s contract:{" "}
        <code>title</code> (string or JSX), <code>children</code>, <code>collapsible</code>,
        <code>expanded</code> (controlled), <code>callToActionComponent</code>,{" "}
        <code>displayState</code> (<code>default | error | warning</code>),{" "}
        <code>clickableHeader</code>.
      </p>
      <p>
        Backed by Base UI&rsquo;s <code>Collapsible</code> primitive when{" "}
        <code>collapsible</code> is set &mdash; gives us ARIA disclosure semantics, keyboard
        toggle, and animated panel height for free. Visual states are L3 tokens in{" "}
        <code>src/app/box-container-tokens.css</code>.
      </p>
    </Page>
  );
}

export function TabIntro() {
  return (
    <Page title="Tab">
      <p>
        A tabbed switcher with a sliding active-tab indicator. Built on Base UI{" "}
        <code>@base-ui/react/tabs</code> &mdash; Radix-style headless primitives, full keyboard
        nav (Arrow keys, Home / End), automatic activation semantics, and an animated{" "}
        <code>Tabs.Indicator</code>.
      </p>
      <p>
        <strong>Behavioural parity</strong>: this is the first component in the pilot where
        keyboard / focus behaviour matters more than pixels. LifeSG&rsquo;s tab implementation
        does arrow-key cycling, automatic activation, and indicator animation; Base UI&rsquo;s
        does the same. Mirroring the API shape (<code>Tab</code> + <code>Tab.Item</code> with
        <code>title</code>) is mechanical.
      </p>
      <p>
        <strong>Two deliberate divergences</strong>. First, LifeSG&rsquo;s{" "}
        <code>currentActive</code> / <code>initialActive</code> use an <em>index</em>; we accept
        either a stable string <code>value</code> or an index for parity. Second, we drop{" "}
        <code>fadeColor</code> / overflow-fade behaviour &mdash; the wrapping
        <code>overflow-x-auto</code> handles scroll without the fade flourish.
      </p>
    </Page>
  );
}

export function AccordionIntro() {
  return (
    <Page title="Accordion">
      <p>
        A vertical list of expandable items. Built on Base UI{" "}
        <code>@base-ui/react/accordion</code> &mdash; gives us ARIA disclosure roles, keyboard
        Enter / Space toggle, and an animated panel height transition. We model the parent /
        item shape as <code>Accordion</code> + <code>Accordion.Item</code> matching LifeSG.
      </p>
      <p>
        Mirrors LifeSG&rsquo;s props: <code>enableExpandAll</code> (shows an &ldquo;Expand all
        / Collapse all&rdquo; toggle in the parent), <code>initialDisplay</code>{" "}
        (<code>expand-all | collapse-all</code>), <code>headingLevel</code> (controls the{" "}
        <code>&lt;h2&gt;</code>...<code>&lt;h6&gt;</code> wrapping the trigger), and{" "}
        <code>onExpandCollapseChange</code>. Per-item <code>type=&quot;small&quot;</code> ports
        the LifeSG denser variant.
      </p>
      <p>
        <strong>What we didn&rsquo;t port</strong>: imperative refs (<code>expand()</code> /
        <code>collapse()</code> on <code>AccordionItem</code>). We kept Base UI&rsquo;s controlled{" "}
        <code>value</code> pattern instead. Migrating LifeSG code that uses these refs needs a
        rewrite to lift state up. Worth a callout in the migration guide.
      </p>
    </Page>
  );
}

export function DataTableIntro() {
  return (
    <Page title="DataTable">
      <p>
        A tabular display with sorting indicators, multi-select with action bar, alternating
        rows, and loading / empty states. Mirrors LifeSG&rsquo;s contract verbatim:{" "}
        <code>headers</code> (strings or <code>HeaderItemProps</code>), <code>rows</code>{" "}
        (objects keyed by <code>fieldKey</code>), <code>sortIndicators</code>,{" "}
        <code>selectedIds</code>, <code>disabledIds</code>, <code>enableMultiSelect</code>,
        <code>enableSelectAll</code>, <code>enableActionBar</code>,{" "}
        <code>actionBarContent</code>, <code>loadState</code>,{" "}
        <code>renderCustomEmptyView</code>, plus the corresponding{" "}
        <code>onHeaderClick</code> / <code>onSelect</code> / <code>onSelectAll</code> /
        <code>onClearSelectionClick</code> callbacks.
      </p>
      <p>
        Built on Base UI <code>Checkbox</code> for the per-row + select-all checkboxes &mdash;
        gives us indeterminate-state semantics, focus management, and keyboard toggle for free.
        Sort headers expose <code>aria-sort</code> for screen readers; sort icons cycle through
        <code> asc → desc → asc</code> on click. The cell renderer supports both static values
        and render-function cells <code>(row, &#123;isSelected&#125;) =&gt; ReactNode</code>{" "}
        identical to LifeSG.
      </p>
      <h2 className="text-base font-semibold pt-2">What we deferred</h2>
      <p>
        <code>enableStickyHeader</code> &mdash; LifeSG implements this with a scroll-watching
        observer; deferred until a real screen exercises it. The empty-view component-shape
        contract (<code>ErrorDisplayAttributes</code>) is supported as a plain ReactNode
        fallback through <code>emptyView</code>; the structured prop-passthrough is one small
        adapter away when we need it.
      </p>
    </Page>
  );
}

export function FullscreenImageCarouselIntro() {
  return (
    <Page title="FullscreenImageCarousel">
      <p>
        A modal-mounted image viewer with thumbnails, zoom, navigation, counter, and optional
        delete. Built on our ported <code>Modal</code> (Overlays category) plus local state.
        Mirrors LifeSG&rsquo;s contract: <code>show</code>, <code>items</code>,{" "}
        <code>initialActiveItemIndex</code>, <code>hideThumbnail</code>,{" "}
        <code>hideNavigation</code>, <code>hideCounter</code>, <code>hideMagnifier</code>,
        <code> zIndex</code>, <code>onDelete</code>, <code>onClose</code>. Imperative ref
        exposes <code>currentItemIndex</code>, <code>setCurrentItem</code>,{" "}
        <code>goToPrevItem</code>, <code>goToNextItem</code>.
      </p>
      <p>
        Item types: <code>type=&quot;image&quot;</code> (with <code>src</code>,{" "}
        <code>alt</code>, optional <code>thumbnailSrc</code>) and{" "}
        <code>type=&quot;custom&quot;</code> (with <code>renderContent</code> for arbitrary
        slide content, e.g. an iframe / embed / PDF viewer).
      </p>
      <h2 className="text-base font-semibold pt-2">What we kept</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Backdrop dismissal, Escape dismissal, focus trap &mdash; via Modal.</li>
        <li>Keyboard nav: <kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd> cycle items.</li>
        <li>Zoom toggle (click image or magnifier button) &mdash; scales 1.5×.</li>
        <li>Counter (&ldquo;1 / 3&rdquo;), file name + size in the toolbar.</li>
        <li>Thumbnail strip at the bottom; active thumb highlighted.</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Divergences from LifeSG</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Zoom is a single-step toggle</strong> (1× / 1.5×) rather than LifeSG&rsquo;s
          continuous magnifier with pan. Sufficient for the pilot; a true magnifier needs a
          separate Lens component.
        </li>
        <li>
          <strong>No swipe gestures</strong> &mdash; touch swipe-to-paginate is a follow-up.
          Pointer + keyboard work today.
        </li>
      </ul>
    </Page>
  );
}
