import type { ReactNode } from "react";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="text-sm text-foreground/80 space-y-3">{children}</div>
    </article>
  );
}

export function OverlaysIntro() {
  return (
    <Page title="Overlays">
      <p>
        Mirrors LifeSG&rsquo;s Storybook <em>Overlays</em> taxonomy. Each component lives in
        the DOM at the document root via React Portal &mdash; focus traps, scroll lock, and
        backdrop dismissal all live in this group.
      </p>
      <h2 className="text-base font-semibold pt-2">Inventory</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Modal</strong> &mdash; ✅ shipped. <code>@base-ui/react/dialog</code>.
          Used by FullscreenImageCarousel + several Form components.</li>
        <li><strong>Popover</strong> &mdash; ✅ shipped. <code>@base-ui/react/popover</code>.
          Refactored 4 inline consumers (DateInput, DateRangeInput, PhoneNumberInput, DateNavigator) to use it.</li>
        <li><strong>Drawer</strong> &mdash; ✅ shipped. Slide-in sheet on{" "}
          <code>@base-ui/react/dialog</code>. Refactored Navbar mobile menu (was hand-rolled).</li>
        <li><strong>Menu</strong> &mdash; ✅ shipped. <code>@base-ui/react/menu</code>. New
          primitive; no existing consumers, ready for action menus / overflow buttons.</li>
        <li><strong>Overlay</strong> &mdash; intentional skip. Encapsulated inside Modal/Drawer/Popover.</li>
        <li><strong>ModalV2</strong> &mdash; ✅ shipped. Slot-composition modal (Card / Content /
          Footer / CloseButton) on the same <code>@base-ui/react/dialog</code> primitive as v1.
          Use v2 for confirm/decision dialogs; v1 for free-form content.</li>
      </ul>
    </Page>
  );
}

export function PopoverIntro() {
  return (
    <Page title="Popover">
      <p>
        Anchored, portal-rendered popup with focus management and outside-click dismissal.
        Backed by <code>@base-ui/react/popover</code>. Wraps the Base UI parts with token-bound
        chrome so consumers don&rsquo;t reach into the primitive directly.
      </p>
      <h2 className="text-base font-semibold pt-2">Composition shape</h2>
      <pre className="my-3 rounded bg-muted p-3 text-xs leading-relaxed overflow-x-auto"><code>{`<Popover>
  <PopoverTrigger render={(props) => <button {...props}>Open</button>} />
  <PopoverContent sideOffset={4}>
    <p>Anything inside.</p>
  </PopoverContent>
</Popover>`}</code></pre>
      <h2 className="text-base font-semibold pt-2">What we kept from LifeSG</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Position control via <code>side</code> + <code>align</code> + <code>sideOffset</code>.</li>
        <li>Custom portal container via <code>container</code> prop (LifeSG&rsquo;s <code>rootNode</code>{" "}
          equivalent). Defaults to <code>document.body</code>.</li>
        <li>Backdrop / Arrow / Close sub-parts re-exported for advanced layouts.</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">What we deferred or diverged on</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>PopoverInline</strong> &mdash; LifeSG ships an inline (non-portaled) variant.
          Base UI Popover requires the Portal sub-component, so true inline rendering isn&rsquo;t
          supported. Closest equivalent: pass a <code>container</code> ref pointing to a parent
          element you control (for z-index / tab-order isolation).</li>
        <li><strong>Hover trigger</strong> &mdash; LifeSG ships <code>trigger=&quot;hover&quot;</code>;
          we don&rsquo;t. Hover popovers are usually a Tooltip (use <code>@base-ui/react/tooltip</code> directly until we port one).</li>
        <li><strong>Animations</strong> &mdash; default is no enter/exit transition. Add CSS via{" "}
          <code>data-[open]</code> / <code>data-[closed]</code> on PopoverContent if needed.</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Used by</h2>
      <p>
        DateInput, DateRangeInput, PhoneNumberInput, DateNavigator. All four were refactored
        from inline <code>@base-ui/react/popover</code> usage to this wrapper as part of the
        Overlays batch.
      </p>
    </Page>
  );
}

export function OverlayIntro() {
  return (
    <Page title="Overlay (intentionally not ported)">
      <p>
        LifeSG&rsquo;s <code>Overlay</code> is the primitive backdrop layer used internally by
        Modal, Drawer, and Popover for the dimmed click-to-dismiss surface behind a popup. It
        isn&rsquo;t a standalone consumer-facing component &mdash; you don&rsquo;t render an{" "}
        <code>Overlay</code> directly in app code.
      </p>
      <h2 className="text-base font-semibold pt-2">Why we skipped it</h2>
      <p>
        In our DS, the backdrop is encapsulated <em>inside</em> each overlay component:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><code>Modal</code> renders <code>Dialog.Backdrop</code> internally.</li>
        <li><code>Drawer</code> renders <code>Dialog.Backdrop</code> with side-anchored slide-in.</li>
        <li><code>Popover</code> doesn&rsquo;t use a backdrop (anchored, not modal).</li>
      </ul>
      <p>
        There&rsquo;s no consumer pattern that would import a standalone Overlay primitive. If
        you ever need a custom backdrop for a non-Modal/Drawer pattern, reach for{" "}
        <code>@base-ui/react/dialog</code>&rsquo;s <code>Backdrop</code> directly.
      </p>
      <p>
        <strong>Status:</strong> intentional skip. No code shipped, no Default page.
      </p>
    </Page>
  );
}

export function ModalV2Intro() {
  return (
    <Page title="ModalV2">
      <p>
        Slot-composition modal. Same Base UI <code>@base-ui/react/dialog</code> primitive as v1,
        but with an opinionated layout that matches LifeSG&rsquo;s v2 anatomy: a fixed-width
        card with generous gutters, content + footer stacked vertically, and an optional close
        button floating at top-right.
      </p>
      <h2 className="text-base font-semibold pt-2">Composition shape</h2>
      <pre className="my-3 rounded bg-muted p-3 text-xs leading-relaxed overflow-x-auto"><code>{`<ModalV2 show={show} onClose={() => setShow(false)}>
  <ModalV2.Card>
    <ModalV2.CloseButton />
    <ModalV2.Content>
      <h2>Confirm appointment</h2>
      <p>Bookings can be rescheduled up to 24 hours in advance.</p>
    </ModalV2.Content>
    <ModalV2.Footer
      primaryButton={<Button onClick={...}>Confirm</Button>}
      secondaryButton={<Button variant="secondary" onClick={...}>Cancel</Button>}
    />
  </ModalV2.Card>
</ModalV2>`}</code></pre>
      <h2 className="text-base font-semibold pt-2">v1 vs v2 — when to reach for which</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>v1 (<code>Modal</code> + <code>Modal.Box</code>)</strong> &mdash; open-ended.
          Wraps any content in a styled box; the consumer owns the inner layout. Pick this for
          dialogs that don&rsquo;t fit a header/body/footer split (e.g.{" "}
          <code>FullscreenImageCarousel</code>&rsquo;s lightbox).</li>
        <li><strong>v2 (slot composition)</strong> &mdash; opinionated. Card/Content/Footer slots
          enforce LifeSG&rsquo;s spacing rhythm (64px gutters, 32px between content + footer)
          and the desktop primary-on-right / mobile-stacked button row. Pick this for
          confirm/decision dialogs and most form-style modals.</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Slot anatomy</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><code>ModalV2.Card</code> &mdash; fixed at 40rem (640px) wide; caps to{" "}
          <code>calc(100% - 3rem)</code> on narrow viewports. Detects whether{" "}
          <code>CloseButton</code> is present and adjusts the first-slot top margin.</li>
        <li><code>ModalV2.CloseButton</code> &mdash; floats top-right with 16px gutter. Wires to{" "}
          the root <code>onClose</code> via context.</li>
        <li><code>ModalV2.Content</code> &mdash; main body slot, 64px horizontal margin on desktop
          (20px on mobile).</li>
        <li><code>ModalV2.Footer</code> &mdash; takes{" "}
          <code>primaryButton</code> + <code>secondaryButton</code> props. Desktop:{" "}
          <code>flex-direction: row-reverse</code> + 32px column-gap so primary sits on the right.
          Mobile: stacked column with 16px row-gap.</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Dismissal semantics</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><code>onClose</code> &mdash; fires on Escape, on close-button click.</li>
        <li><code>onOverlayClick</code> &mdash; fires only when backdrop is clicked (and only if{" "}
          <code>enableOverlayClick</code>). Backdrop click does <em>not</em> auto-fire{" "}
          <code>onClose</code>; the consumer decides whether to dismiss.</li>
        <li><code>enableOverlayClick</code> &mdash; default <code>true</code>. Set false to make
          the backdrop inert (mandatory-decision dialogs).</li>
        <li><code>dismissKeyboardOnShow</code> &mdash; default <code>true</code>. Blurs the
          active element on open so a soft keyboard collapses on mobile.</li>
        <li><code>disableInitialFocus</code> &mdash; skip auto-focusing the first focusable
          element inside the modal on open.</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Tokens</h2>
      <p>
        New L3 namespace <code>--modal-v2-*</code> in{" "}
        <code>src/app/overlays-tokens.css</code> covers card chrome (bg, radius, shadow, width),
        slot gutters, footer gaps, and the close-button margin. Slot vertical spacing (first/
        last/between-content-and-footer) is encoded as scoped CSS rules on{" "}
        <code>[data-slot=&quot;modal-v2-spacer&quot;]</code> rather than ten arbitrary Tailwind
        variants &mdash; same rule shape as LifeSG&rsquo;s styled-components selectors.
      </p>
      <h2 className="text-base font-semibold pt-2">What did not get ported</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><code>rootComponentId</code> &mdash; LifeSG&rsquo;s DOM-id-lookup portal target. Same
          deferral as v1 (Base UI Dialog defaults to <code>document.body</code>; pass a{" "}
          <code>container</code> ref directly if needed).</li>
        <li>The internal visual-viewport tracking LifeSG uses to handle iOS Safari&rsquo;s
          mobile-keyboard offset &mdash; Base UI handles scroll lock; the dynamic-viewport
          quirks haven&rsquo;t been re-implemented and may need a follow-up if mobile usage
          reveals layout issues.</li>
      </ul>
    </Page>
  );
}

export function MenuIntro() {
  return (
    <Page title="Menu">
      <p>
        Action menu / context menu / dropdown menu primitive. Built on{" "}
        <code>@base-ui/react/menu</code> with full keyboard navigation, type-ahead, focus
        management, and ARIA wiring.
      </p>
      <h2 className="text-base font-semibold pt-2">Composition shape</h2>
      <pre className="my-3 rounded bg-muted p-3 text-xs leading-relaxed overflow-x-auto"><code>{`<Menu>
  <MenuTrigger>...</MenuTrigger>
  <MenuContent>
    <MenuItem onClick={...}>Edit</MenuItem>
    <MenuSeparator />
    <MenuGroup>
      <MenuGroupLabel>Format</MenuGroupLabel>
      <MenuCheckboxItem checked={bold} onCheckedChange={setBold}>Bold</MenuCheckboxItem>
    </MenuGroup>
    <MenuRadioGroup value={align} onValueChange={setAlign}>
      <MenuRadioItem value="left">Left</MenuRadioItem>
    </MenuRadioGroup>
  </MenuContent>
</Menu>`}</code></pre>
      <h2 className="text-base font-semibold pt-2">Item types</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><code>MenuItem</code> &mdash; standard action item with onClick.</li>
        <li><code>MenuLinkItem</code> &mdash; navigates via href, behaves like an anchor.</li>
        <li><code>MenuCheckboxItem</code> &mdash; toggleable with check indicator.</li>
        <li><code>MenuRadioItem</code> (inside <code>MenuRadioGroup</code>) &mdash; mutually exclusive with dot indicator.</li>
        <li><code>MenuSubmenuTrigger</code> &mdash; nested submenu support (re-export from Base UI).</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Why we ported it</h2>
      <p>
        LifeSG doesn&rsquo;t ship a public Menu component &mdash; their Sidenav and similar use
        internal primitives. This is a forward-looking port for action menus on Cards, &ldquo;more&rdquo;
        overflow buttons, and rich-text formatting toolbars.
      </p>
      <h2 className="text-base font-semibold pt-2">Token sharing</h2>
      <p>
        Reuses Popover&rsquo;s L3 tokens (<code>--popover-bg</code>, <code>--popover-border</code>,{" "}
        <code>--popover-radius</code>, <code>--popover-shadow</code>) since the popup chrome is
        identical in shape.
      </p>
    </Page>
  );
}

export function DrawerIntro() {
  return (
    <Page title="Drawer">
      <p>
        A focus-trapped, scroll-locked sheet that slides in from one edge. Built on the same{" "}
        <code>@base-ui/react/dialog</code> primitive as Modal &mdash; differs only in positioning
        + transform animation (slides from edge instead of fades-in centred).
      </p>
      <h2 className="text-base font-semibold pt-2">Composition shape</h2>
      <pre className="my-3 rounded bg-muted p-3 text-xs leading-relaxed overflow-x-auto"><code>{`<Drawer open={open} onOpenChange={setOpen}>
  <button onClick={() => setOpen(true)}>Open</button>
  <DrawerContent side="right">
    <DrawerHeader><DrawerTitle>Settings</DrawerTitle></DrawerHeader>
    <DrawerBody>...</DrawerBody>
    <DrawerFooter>
      <Button onClick={() => setOpen(false)}>Done</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}</code></pre>
      <h2 className="text-base font-semibold pt-2">Sides</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><code>right</code> (default), <code>left</code>: <code>320px</code> wide, full-height (token: <code>--drawer-width-side</code>).</li>
        <li><code>top</code>, <code>bottom</code>: full-width, <code>60vh</code> tall (token: <code>--drawer-height-side</code>).</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">What Base UI gives us for free</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Focus trap + restore-on-close.</li>
        <li>Scroll lock on body while open.</li>
        <li>Escape + outside-click dismissal.</li>
        <li>ARIA wiring (<code>role=&quot;dialog&quot;</code>, <code>aria-modal</code>).</li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Refactored from inline usage</h2>
      <p>
        Navbar&rsquo;s mobile menu was hand-rolling a backdrop + slide panel without focus trap,
        scroll lock, or Escape support. As of this batch it uses Drawer, gaining all four for free.
      </p>
      <h2 className="text-base font-semibold pt-2">What did NOT get refactored</h2>
      <p>
        Sidenav has a sub-component called <code>DrawerPanel</code> &mdash; this is a{" "}
        <em>persistent side column</em>, not a modal-style sheet, and doesn&rsquo;t fit this
        primitive&rsquo;s shape (no overlay, no focus trap, no portal). The naming is unfortunate;
        we kept the existing implementation rather than rewriting Sidenav&rsquo;s layout model.
      </p>
    </Page>
  );
}

export function ModalIntro() {
  return (
    <Page title="Modal">
      <p>
        A focus-trapped, scroll-locked, backdrop-dimmed dialog rendered into a Portal. Backed
        by Base UI <code>@base-ui/react/dialog</code>. Mirrors LifeSG&rsquo;s contract:{" "}
        <code>show</code>, <code>onOverlayClick</code>, <code>enableOverlayClick</code>,
        <code> zIndex</code>, <code>animationFrom</code> (<code>top|bottom|left|right</code>).
      </p>
      <p>
        <code>Modal.Box</code> is the inner content box &mdash; styled wrapper with optional{" "}
        <code>showCloseButton</code> and <code>onClose</code>. Render any content inside.
      </p>
      <h2 className="text-base font-semibold pt-2">What Base UI gives us for free</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Focus trap</strong> &mdash; <kbd>Tab</kbd> cycles within the dialog;{" "}
          <kbd>Shift+Tab</kbd> in reverse.
        </li>
        <li>
          <strong>Restore-on-close</strong> &mdash; focus returns to the trigger element when
          the dialog closes.
        </li>
        <li>
          <strong>Scroll lock</strong> on <code>document.body</code> while open.
        </li>
        <li>
          <strong>Escape key</strong> dismisses the dialog (unless disabled).
        </li>
        <li>
          <strong>Outside click</strong> dismisses, controllable via{" "}
          <code>enableOverlayClick</code>.
        </li>
        <li>
          <strong>ARIA wiring</strong> &mdash; <code>role=&quot;dialog&quot;</code> + <code>aria-modal</code>;{" "}
          pass <code>aria-label</code> or <code>aria-labelledby</code> via props.
        </li>
      </ul>
      <h2 className="text-base font-semibold pt-2">Divergence</h2>
      <p>
        LifeSG&rsquo;s <code>rootComponentId</code> prop targets a specific DOM container for
        the portal. We don&rsquo;t expose this yet &mdash; Base UI defaults to{" "}
        <code>document.body</code>. If a real screen needs a non-body root, add it as a thin
        wrapper around Base UI&rsquo;s <code>Dialog.Portal container={"{ref}"}</code>.
      </p>
    </Page>
  );
}

export function PopoverV2Intro() {
  return (
    <Page title="PopoverV2">
      <p>
        LifeSG&rsquo;s v2 popover surface &mdash; a floating card that opens off a trigger
        element. Compound API: <code>PopoverV2</code> (the card root), <code>PopoverV2.Trigger</code>{" "}
        (the high-level wrapper with trigger / position / delay knobs),{" "}
        <code>PopoverV2.Inline</code> (link-styled inline trigger with underline treatment and an
        optional trailing info icon).
      </p>
      <h2 className="text-base font-semibold pt-2">Built on Base UI</h2>
      <p>
        Floating positioning uses Base UI&rsquo;s <code>Popover</code> primitives;
        hover-trigger open / close delays are layered on top of the click-trigger behaviour.
      </p>
      <h2 className="text-base font-semibold pt-2">Deferred</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>enableResize</strong> &mdash; LifeSG sizes the popover to the remaining viewport
          height automatically. Set <code>maxHeight</code> + <code>overflow</code> on the{" "}
          <code>PopoverV2</code> card manually for now.
        </li>
        <li>
          <strong>Mobile ModalV2 takeover</strong> &mdash; on <code>&lt; sm</code> viewports
          LifeSG renders the popover full-screen via ModalV2. Add when the agency&rsquo;s mobile UX
          is decided.
        </li>
        <li>
          <strong>rootNode portal</strong> &mdash; render-into-rootNode targeting is not yet
          wired. Falls back to <code>document.body</code>.
        </li>
      </ul>
    </Page>
  );
}
