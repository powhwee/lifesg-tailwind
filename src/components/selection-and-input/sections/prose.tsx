import type { ReactNode } from "react";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="text-sm text-foreground/80 space-y-3">{children}</div>
    </article>
  );
}

export function SelectionAndInputIntro() {
  return (
    <Page title="Selection and Input">
      <p>
        Mirrors LifeSG&rsquo;s Storybook <em>Selection and Input</em> taxonomy. Components in this
        category capture user choice or input &mdash; buttons, selection primitives, file actions,
        date pickers, and specialty inputs.
      </p>
      <p>
        First sub-batch: <strong>Button</strong> (slotted in from the original pilot port),
        <strong> Checkbox</strong>, <strong>RadioButton</strong>, <strong>Toggle</strong>. Each
        comparison page renders our L3-tokened implementation on the left and the equivalent
        LifeSG component on the right.
      </p>
      <p>
        Subsequent batches will add IconButton, ImageButton, OtpInput, FeedbackRating,
        DateNavigator, Calendar, and Filter. SingpassButton is intentionally dropped &mdash;
        Singapore-government-platform-specific. The TimeSlot family (Schedule, TimeSlotBar,
        TimeSlotBarWeek, TimeSlotWeekView, TimeTable) is deferred to a focused follow-up batch.
      </p>
    </Page>
  );
}

export function ButtonIntro() {
  return (
    <Page title="Button">
      <p>
        The Button was the first component ported in this pilot &mdash; it lives at{" "}
        <code>src/components/ui/button.tsx</code> with its L3 tokens in{" "}
        <code>src/app/button-tokens.css</code>. Six variants (default / outline / secondary / ghost
        / destructive / link), four sizes, plus icon-shaped variants (<code>icon</code>,{" "}
        <code>icon-xs</code>, <code>icon-sm</code>, <code>icon-lg</code>).
      </p>
      <p>
        Built on Base UI <code>@base-ui/react/button</code> for proper{" "}
        <code>aria-pressed</code> / <code>aria-disabled</code> wiring, plus LifeSG&rsquo;s
        line-height and disabled-state convention. Pixel-identical bounding boxes vs LifeSG across
        all six variants &mdash; verified with <code>scripts/measure.mjs</code>. See the entry in{" "}
        <code>working-logs/pilot-findings.md</code> from 2026-05-10.
      </p>
      <h2 className="text-base font-semibold pt-2">Why slotted into Selection and Input</h2>
      <p>
        LifeSG&rsquo;s Storybook taxonomy puts Button under <em>Selection and Input</em>, alongside
        Checkbox / RadioButton / Toggle / etc. We&rsquo;re mirroring that grouping here so the
        sidebar matches LifeSG&rsquo;s docs. The Button itself isn&rsquo;t re-implemented &mdash;
        the registry just points at the existing component.
      </p>
    </Page>
  );
}

export function CheckboxIntro() {
  return (
    <Page title="Checkbox">
      <p>
        A checkbox with checked / unchecked / indeterminate / disabled / error states. Built on
        Base UI <code>@base-ui/react/checkbox</code> &mdash; gives us the indeterminate state
        primitive, focus management, and a hidden native input for form submission.
      </p>
      <p>
        Mirrors LifeSG&rsquo;s prop surface: <code>checked</code>, <code>indeterminate</code>,{" "}
        <code>displaySize</code> (<code>default | small</code>),{" "}
        <code>disabled</code>, plus normal HTML input attributes. Use <code>aria-invalid</code>
        for the error state &mdash; matches the pattern established on Button.
      </p>
      <h2 className="text-base font-semibold pt-2">Sizing convention</h2>
      <p>
        <code>default</code> is 24px, <code>small</code> is 20px &mdash; matches LifeSG. Tick icon
        is Lucide <code>Check</code> (3px stroke), indeterminate is <code>Minus</code>. Feel free
        to swap to a heavier icon if the agency design calls for it.
      </p>
    </Page>
  );
}

export function RadioButtonIntro() {
  return (
    <Page title="RadioButton">
      <p>
        A single radio with checked / unchecked / disabled / error states. Built on Base UI{" "}
        <code>@base-ui/react/radio</code> + <code>@base-ui/react/radio-group</code> &mdash; the
        group component manages the controlled <code>value</code>, keyboard arrow-key cycling, and
        focus traversal.
      </p>
      <p>
        Mirrors LifeSG&rsquo;s prop surface: <code>checked</code>, <code>displaySize</code>{" "}
        (<code>default | small</code>), <code>disabled</code>, plus normal input attributes. The
        <code>value</code> prop is required by Base UI&rsquo;s RadioGroup contract, even when used
        standalone.
      </p>
      <h2 className="text-base font-semibold pt-2">Standalone vs grouped</h2>
      <p>
        Unlike LifeSG, Base UI distinguishes between a single radio and a group. Almost every real
        usage wants a group &mdash; <code>RadioGroup</code> is re-exported from this module so
        callers can do <code>import {`{ RadioButton, RadioGroup }`} from</code>{" "}
        <code>&quot;@/components/ui/radio-button&quot;</code>. For one-off checkbox-shaped
        single-radio usage, prefer Checkbox.
      </p>
    </Page>
  );
}

export function ToggleIntro() {
  return (
    <Page title="Toggle">
      <p>
        <strong>Important:</strong> LifeSG&rsquo;s Toggle is <em>not</em> a switch. It&rsquo;s a
        labelled selection card &mdash; a bordered tile with a checkbox, radio, or yes/no
        indicator inside. Mirrors LifeSG&rsquo;s prop surface: <code>type</code>{" "}
        (<code>checkbox | radio | yes | no</code>), <code>checked</code>, <code>subLabel</code>,
        <code> compositeSection</code>, <code>disabled</code>, <code>error</code>,{" "}
        <code>styleType</code> (<code>default | no-border</code>).
      </p>
      <h2 className="text-base font-semibold pt-2">Indicator semantics</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <code>checkbox</code> &mdash; allows deselection, renders our <code>Checkbox</code>{" "}
          inside the tile.
        </li>
        <li>
          <code>radio</code> &mdash; does not allow deselection, renders our{" "}
          <code>RadioButton</code>; pair with a parent <code>RadioGroup</code> for grouped
          behaviour.
        </li>
        <li>
          <code>yes</code> / <code>no</code> &mdash; specialised disc-shaped indicator (green check
          or red cross). Behaves like a checkbox for state purposes.
        </li>
      </ul>
      <h2 className="text-base font-semibold pt-2">What we deferred</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <code>removable</code> + <code>onRemove</code> (in-tile remove button).
        </li>
        <li>
          <code>compositeSection.collapsible</code> + <code>initialExpanded</code> (collapsible
          sub-content).
        </li>
        <li>
          <code>childrenMaxLines</code> truncation (mobile / tablet / desktop line clamps).
        </li>
        <li>
          <code>useContentWidth</code> (min-width: fit-content variant).
        </li>
      </ul>
      <p>
        These are real LifeSG features but not load-bearing for the pilot&rsquo;s parity question.
        Add when a real screen needs them.
      </p>
    </Page>
  );
}

export function IconButtonIntro() {
  return (
    <Page title="IconButton">
      <p>
        Square icon-only button. Mirrors LifeSG&rsquo;s prop surface:{" "}
        <code>styleType</code> (<code>primary | secondary | light</code>),{" "}
        <code>sizeType</code> (<code>large | default | small</code>), all standard{" "}
        <code>ButtonHTMLAttributes</code>.
      </p>
      <p>
        Built on Base UI <code>@base-ui/react/button</code> for the same{" "}
        <code>aria-pressed</code> / <code>aria-disabled</code> contract as Button. Sizes pair an
        outer dimension with an inner SVG size: small (40&times;40 / 16px), default (48&times;48 / 20px),
        large (56&times;56 / 24px). Override per call with an explicit{" "}
        <code>className=&quot;size-N&quot;</code> on the SVG.
      </p>
      <p>
        <strong>Always pass <code>aria-label</code></strong> &mdash; an icon-only button with no
        accessible name fails a basic a11y check. The component itself doesn&rsquo;t enforce this
        (would be too restrictive for label-via-tooltip patterns), but treat it as required.
      </p>
    </Page>
  );
}

export function ImageButtonIntro() {
  return (
    <Page title="ImageButton">
      <p>
        Square image-shaped tappable card with optional selection and error states. Mirrors
        LifeSG&rsquo;s contract: <code>imgSrc</code>, <code>selected</code>, <code>error</code>,
        plus standard <code>ButtonHTMLAttributes</code>. Common use: a chooser grid of avatars,
        themes, or thumbnails.
      </p>
      <p>
        Visual: the image fills the button. <code>selected</code> renders a primary-coloured
        checkmark badge in the top-right corner and a primary-coloured border.{" "}
        <code>error</code> swaps the border to the error-strong colour. <code>aria-pressed</code>{" "}
        is wired to <code>selected</code>; <code>aria-invalid</code> to <code>error</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">Sizing</h2>
      <p>
        Defaults to <code>aspect-square</code> &mdash; consumer controls the actual size by setting
        a <code>className</code> width (e.g. <code>w-20</code>) on the parent grid. LifeSG&rsquo;s
        version requires explicit <code>style={`{{ width, height }}`}</code> &mdash; ours uses
        Tailwind utilities and aspect-ratio.
      </p>
    </Page>
  );
}

export function OtpInputIntro() {
  return (
    <Page title="OtpInput">
      <p>
        Segmented one-time-password input with a verify/resend button and cooldown timer. Mirrors
        LifeSG&rsquo;s contract: <code>numOfInput</code>, <code>value</code>,{" "}
        <code>onChange(value: string[])</code>, <code>cooldownDuration</code>,{" "}
        <code>actionButtonProps</code>, optional <code>prefix</code> ({" "}
        <code>{`{ value, separator: "-" }`}</code>), <code>errorMessage</code>,{" "}
        <code>otpOnly</code>, plus the cooldown lifecycle callbacks{" "}
        <code>onCountdownChange</code> / <code>onCooldownStart</code> / <code>onCooldownEnd</code>.
      </p>
      <p>
        Built on Base UI <code>@base-ui/react/otp-field</code> &mdash; gives us the auto-focus
        progression between slots, paste-to-fill across slots, backspace-to-previous-slot, and
        proper <code>autocomplete=&quot;one-time-code&quot;</code> wiring for SMS autofill on iOS
        / Android.
      </p>
      <h2 className="text-base font-semibold pt-2">What we deferred</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Imperative <code>ref.startCooldown()</code></strong> &mdash; LifeSG exposes a
          ref-method to programmatically trigger the cooldown. We deferred this; cooldown starts
          on action-button click. If a real screen needs it (e.g. trigger cooldown on form-submit
          rather than button-click), expose it via <code>useImperativeHandle</code>.
        </li>
        <li>
          <strong>Multi-character separator</strong> &mdash; LifeSG hard-codes <code>&quot;-&quot;</code>{" "}
          and types it as such. We mirror.
        </li>
      </ul>
    </Page>
  );
}

export function FeedbackRatingIntro() {
  return (
    <Page title="FeedbackRating">
      <p>
        A complete &ldquo;rate your experience&rdquo; widget &mdash; not just stars. Mirrors
        LifeSG&rsquo;s contract: <code>imgSrc</code> (optional header image),{" "}
        <code>description</code>, <code>buttonLabel</code>, <code>rating</code>{" "}
        (1&ndash;5, 0 means none), <code>onRatingChange</code>, <code>onSubmit</code>.
      </p>
      <p>
        The five stars are <code>role=&quot;radio&quot;</code> buttons inside a{" "}
        <code>role=&quot;radiogroup&quot;</code> &mdash; selecting a star sets <code>rating</code>{" "}
        and the user submits via the action button. Active stars fill with the warning-50 tone;
        keyboard focus is fully wired.
      </p>
      <h2 className="text-base font-semibold pt-2">CDN proxy for the default image</h2>
      <p>
        For the comparison page the <code>imgSrc</code> example points at LifeSG&rsquo;s{" "}
        <code>assets.life.gov.sg</code> CDN &mdash; same logic as ErrorDisplay. Replace with the
        agency&rsquo;s own asset when illustrations are designed; the prop accepts any URL.
      </p>
    </Page>
  );
}

export function DateNavigatorIntro() {
  return (
    <Page title="DateNavigator">
      <p>
        Day-stepper navigation: previous arrow, date display, next arrow. Optional click-the-date
        to open a calendar dropdown for jump-to-date. Mirrors LifeSG&rsquo;s contract:{" "}
        <code>selectedDate</code> (YYYY-MM-DD), <code>minDate</code>, <code>maxDate</code>,{" "}
        <code>view</code> (<code>day | week</code>), <code>showDateAsShortForm</code>,{" "}
        <code>showCurrentDateAsToday</code>, <code>loading</code>, plus the
        <code> onLeftArrowClick</code> / <code>onRightArrowClick</code> /{" "}
        <code>onCalendarDateSelect</code> handlers.
      </p>
      <p>
        The dropdown calendar uses Base UI <code>@base-ui/react/popover</code> &mdash; gives us
        portal mounting, focus management, escape-to-close, and outside-click dismissal. Inside
        the popover we render the ported <code>Calendar</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">What we deferred</h2>
      <p>
        <code>dropdownRootNode</code> &mdash; LifeSG lets you scope the portal to a specific
        DOM container for z-index isolation. Base UI&rsquo;s default is <code>document.body</code>;
        a wrapper that threads <code>container={`{ref}`}</code> to <code>Popover.Portal</code>{" "}
        is one small change away when needed.
      </p>
    </Page>
  );
}

export function CalendarIntro() {
  return (
    <Page title="Calendar">
      <p>
        Single or multi-select date picker. Mirrors LifeSG&rsquo;s contract:{" "}
        <code>variant</code> (<code>single | multi</code>), per-variant{" "}
        <code>value</code>/<code>values</code> + <code>onChange</code>,{" "}
        <code>minDate</code>/<code>maxDate</code>, <code>disabledDates</code>,{" "}
        <code>minSelectable</code>/<code>maxSelectable</code> (multi), <code>styleType</code>{" "}
        (<code>no-border | bordered</code>), <code>onHover</code>,{" "}
        <code>onYearMonthDisplayChange</code>.
      </p>
      <p>
        Built on <code>react-day-picker</code> &mdash; the canonical shadcn pick. Gives us the
        month grid, navigation, weekday header, day-cell rendering, and keyboard navigation
        (Arrow keys, Home / End, PageUp / PageDown for month / year jumps). All visual properties
        flow through L3 tokens in <code>calendar-tokens.css</code>.
      </p>
      <h2 className="text-base font-semibold pt-2">Date format</h2>
      <p>
        LifeSG uses <code>YYYY-MM-DD</code> string everywhere; we convert to/from{" "}
        <code>Date</code> at the component boundary. Avoids ISO-with-time and timezone gotchas
        from <code>new Date(&quot;2026-05-12&quot;)</code>, which would parse as UTC midnight
        and shift to the previous day in some locales.
      </p>
      <h2 className="text-base font-semibold pt-2">What we deferred</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <code>onSelect</code> alias for <code>onChange</code> &mdash; LifeSG marks it deprecated;
          we don&rsquo;t need both.
        </li>
        <li>
          Year and month-only views &mdash; LifeSG ships these as variants of the same component
          via <code>currentView</code>. react-day-picker exposes them via captionLayout; not
          surfaced yet.
        </li>
      </ul>
    </Page>
  );
}

export function FilterIntro() {
  return (
    <Page title="Filter">
      <p>Coming next sub-batch.</p>
    </Page>
  );
}
