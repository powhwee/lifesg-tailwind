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
        <li><strong>ModalV2</strong> &mdash; deferred. v1 covers current needs.</li>
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
    <Page title="ModalV2 (deferred)">
      <p>
        LifeSG ships both <code>Modal</code> (v1) and <code>ModalV2</code>. Our DS ports v1 only;
        v2 is deferred to a follow-up batch.
      </p>
      <h2 className="text-base font-semibold pt-2">What changed in v2 (per LifeSG)</h2>
      <p>
        We haven&rsquo;t audited v2 yet. The package shape suggests a different prop API
        (slot-based content composition instead of <code>Modal.Box</code>) but the behavioural
        contract is similar.
      </p>
      <h2 className="text-base font-semibold pt-2">Why deferred</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>v1 Modal is already shipped on <code>@base-ui/react/dialog</code> and used by{" "}
          FullscreenImageCarousel + several Form components.</li>
        <li>No real consumer of our DS has asked for v2 prop shape.</li>
        <li>Auditing v2 vs v1 differences and deciding whether to (a) ship a separate v2 wrapper,{" "}
          (b) replace v1, or (c) consolidate into a single Modal that covers both shapes &mdash; is
          a real design question, not a mechanical port.</li>
      </ul>
      <p>
        <strong>Status:</strong> deferred. Revisit when a consumer needs v2 features or when
        LifeSG deprecates v1.
      </p>
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
