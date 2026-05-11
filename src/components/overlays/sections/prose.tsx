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
      <p>
        First entry: <code>Modal</code>, backed by Base UI <code>Dialog</code>. Required by
        <code> FullscreenImageCarousel</code> in the Content category and several Form
        components downstream.
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
