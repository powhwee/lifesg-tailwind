import type { ReactNode } from "react";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="text-sm text-foreground/80 space-y-3">{children}</div>
    </article>
  );
}

export function NavigationIntro() {
  return (
    <Page title="Navigation">
      <p>
        Mirrors LifeSG&rsquo;s Storybook <em>Navigation</em> taxonomy. Each <em>Default</em> page
        renders our L3-tokened implementation on the left and the equivalent LifeSG component on
        the right.
      </p>
      <p>
        Coverage in this batch: nine of LifeSG&rsquo;s ten Navigation primitives. Language Switcher
        is intentionally dropped &mdash; the agency this pilot targets is monolingual English.
        Drawer is not a published primitive in LifeSG&rsquo;s taxonomy; Navbar bundles a private
        Drawer internal, and we mirror that by inlining the mobile menu in our Navbar rather than
        shipping a standalone primitive.
      </p>
      <p>
        Pilot signal in this batch: <code>LocalNav</code> (scroll-spy + sticky behaviour) and
        <code>Sidenav</code> (compound API with a slide-out drawer) extend the
        behavioural-parity story established by <code>Tab</code>/<code>Accordion</code> in
        Content. <code>Navbar</code> and <code>Footer</code> are skeletal app-shell ports &mdash;
        the brand-pinned bits (logo, copyright, addons) are stand-ins until agency branding
        stabilises.
      </p>
    </Page>
  );
}

export function AvatarIntro() {
  return (
    <Page title="Avatar">
      <p>
        Small circular surface displaying initials, an icon, or an image. LifeSG ships two sizes
        (<code>default</code>, <code>small</code>); we mirror them via a <code>sizeType</code>
        prop. The component accepts <code>string | JSX.Element</code> children &mdash; strings get
        rendered as text (initials), JSX elements get rendered as-is (icon or
        <code>&lt;img&gt;</code>).
      </p>
    </Page>
  );
}

export function BreadcrumbIntro() {
  return (
    <Page title="Breadcrumb">
      <p>
        Horizontal trail of links with a separator between segments. LifeSG ships two separator
        styles (<code>chevron</code>, <code>slash</code>); we mirror both via a
        <code>separator</code> prop. Each segment is a normal anchor with whatever
        <code>href</code>/handlers you pass via the <code>links</code> array.
      </p>
      <p>
        LifeSG also ships a <code>fadeColor</code> / <code>fadePosition</code> overflow flourish
        for long trails on narrow viewports. We drop it &mdash; on overflow, the parent can use
        <code>overflow-x-auto</code> or a CSS mask. Trivial to re-add if brand calls for it.
      </p>
    </Page>
  );
}

export function LinkListIntro() {
  return (
    <Page title="LinkList">
      <p>
        Vertical list of anchored links, each optionally prefixed with an icon. LifeSG&rsquo;s
        version is a styled <code>&lt;ul&gt;</code> with one component per list item; we mirror
        that shape (<code>LinkList</code> / <code>LinkList.Item</code>) so consumer JSX migrates
        with an import swap.
      </p>
    </Page>
  );
}

export function MastheadIntro() {
  return (
    <Page title="Masthead">
      <p>
        The standard Singapore Government masthead banner: &ldquo;A Singapore Government Agency
        Website&rdquo; with an expandable explainer about identifying official websites. LifeSG
        ships this verbatim; we mirror the visible content exactly, since this is government
        boilerplate copy that we shouldn&rsquo;t paraphrase.
      </p>
      <p>
        The component is mostly static with a single disclosure: the &ldquo;How to identify&rdquo;
        section expands to reveal two columns of guidance. Built on Base UI Collapsible to share
        the disclosure machinery with Accordion.
      </p>
    </Page>
  );
}

export function PaginationIntro() {
  return (
    <Page title="Pagination">
      <p>
        Page-number pagination with previous/next arrows and optional first/last jumps. Mirrors
        LifeSG&rsquo;s controlled API: pass <code>activePage</code>, <code>totalItems</code>,
        <code>pageSize</code>, and an <code>onPageChange</code> handler. The page-size changer is
        opt-in via <code>showPageSizeChanger</code> + <code>pageSizeOptions</code>.
      </p>
      <p>
        The window-and-ellipsis algorithm mirrors LifeSG&rsquo;s &mdash; first, last, current ±1,
        ellipsis to fill gaps &mdash; so the rendered button count matches at any page count.
      </p>
    </Page>
  );
}

export function LocalNavIntro() {
  return (
    <Page title="LocalNav">
      <p>
        In-page anchor navigation that highlights the active section as the user scrolls. Two
        layouts mirror LifeSG&rsquo;s: <code>LocalNav.Menu</code> (horizontal pill list, desktop)
        and <code>LocalNav.Dropdown</code> (collapsed trigger + sheet, mobile / narrow).
      </p>
      <p>
        Scroll-spy uses <code>IntersectionObserver</code> on each section (no scroll listener
        churn). The dropdown variant also implements a sticky offset so the trigger pins to the
        viewport top once it scrolls out of its inline position &mdash; <code>stickyOffset</code>
        prop, mirroring LifeSG.
      </p>
    </Page>
  );
}

export function SidenavIntro() {
  return (
    <Page title="Sidenav">
      <p>
        Vertical app navigation pinned to the left edge. Compound API mirrors LifeSG verbatim:
        <code>Sidenav</code> / <code>Sidenav.Group</code> / <code>Sidenav.Item</code> /
        <code>Sidenav.DrawerItem</code> / <code>Sidenav.DrawerSubitem</code>. Top-level items are
        icon buttons; items with children open a slide-out drawer panel with nested links.
      </p>
      <p>
        The drawer is implemented as a sibling overlay (not a separate Drawer primitive). When
        agency UX needs reuse across other surfaces (filter panels, settings sheets), the drawer
        machinery can be extracted into Overlays.
      </p>
    </Page>
  );
}

export function NavbarIntro() {
  return (
    <Page title="Navbar (skeletal)">
      <p>
        Top-level site header with branding, primary nav items, and action buttons. This port is
        intentionally <em>skeletal</em> &mdash; it ports the visual shell and desktop-vs-mobile
        switch, but does not mirror LifeSG&rsquo;s full prop surface (download-button helper,
        action-button typing, drawer-dismissal exclusions, custom render functions).
      </p>
      <p>
        Mobile menu is inlined inside Navbar rather than extracted as a reusable Drawer primitive,
        matching the way LifeSG ships it (private <code>navbar/drawer.d.ts</code> internal, no
        public Drawer story).
      </p>
      <p>
        Reasonable next step before any production use: agency branding is locked, action-button
        contract is decided, and the mobile menu UX is reviewed.
      </p>
    </Page>
  );
}

export function FooterIntro() {
  return (
    <Page title="Footer (skeletal)">
      <p>
        Site footer with multi-column links, disclaimer links (privacy / terms / report
        vulnerability), and a copyright line. This port is intentionally <em>skeletal</em> &mdash;
        the LifeSG <code>showDownloadAddon</code> (app-store badges) and
        <code>showResourceAddon</code> (cross-brand resource links) are dropped, since both are
        Singapore-government-platform-specific and unlikely to apply outside LifeSG itself.
      </p>
      <p>
        The disclaimer-links data structure mirrors LifeSG&rsquo;s &mdash; pass overrides via
        <code>disclaimerLinks</code> or accept the defaults.
      </p>
    </Page>
  );
}
