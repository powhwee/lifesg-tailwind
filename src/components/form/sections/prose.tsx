function Prose({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-sm max-w-3xl px-8 py-10 [&>h1]:mb-2 [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-xl [&>h2]:font-semibold [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>p]:mb-3 [&>p]:text-sm [&>p]:leading-relaxed [&>ul]:my-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:text-sm [&>ul>li]:my-1 [&>code]:font-mono [&>code]:text-xs [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary">
      {children}
    </article>
  );
}

export function FormIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">Form</h1>
      <p>
        Mirrors LifeSG&rsquo;s Storybook <em>Form</em> taxonomy. 12 of ~25 entries ported in this batch:
        CustomField, DateInput, DateRangeInput, InputGroup, Input, Label, MaskedInput,
        MultiSelect, PhoneNumberInput, Select, Textarea, UnitNumberInput.
      </p>
      <h2>The composition shift from LifeSG</h2>
      <p>
        LifeSG ships every form component pre-composed: <code>&lt;Form.Input label=&quot;Email&quot; errorMessage=&quot;...&quot;&gt;</code>{" "}
        is one component that bakes in label, error display, and a 12-column grid layout.
        We split that into two layers:
      </p>
      <ul>
        <li><strong>Headless &lt;Field&gt;</strong> backed by Base UI&rsquo;s field primitive (Root / Label / Description / Error). Owns label/error wiring + a11y.</li>
        <li><strong>Raw inputs</strong> (Input, Select, Textarea, etc.) — slot inside Field, or stand alone.</li>
        <li><strong>Convenience wrappers</strong> (FormInput, FormSelect, etc.) — thin one-line composition for the common shape, kept for migration ergonomics.</li>
      </ul>
      <p>
        Layout (responsive grid columns) lives in our existing <code>&lt;Layout.ColDiv&gt;</code> rather than baked into every form component.
      </p>
      <h2>What&rsquo;s deferred from this batch</h2>
      <p>
        E-Signature, HistogramSlider, NestedMultiSelect, NestedSelect, OtpVerification,
        PredictiveTextInput, RangeSelect, RangeSlider, SelectHistogram, Slider, TimeRangePicker,
        Timepicker. Picked up in subsequent batches.
      </p>
    </Prose>
  );
}

export function CustomFieldIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">CustomField</h1>
      <p>
        LifeSG&rsquo;s <code>Form.CustomField</code> is the field-wrapper-with-no-baked-in-input —
        it accepts arbitrary children and decorates them with label, error, and grid spacing.
      </p>
      <h2>Our equivalent</h2>
      <p>
        Two shapes, both in this DS:
      </p>
      <ul>
        <li>
          <strong>FormField</strong> — props-driven convenience wrapper:
          <code>&lt;FormField label=&quot;...&quot; description=&quot;...&quot; errorMessage=&quot;...&quot;&gt;&lt;Input/&gt;&lt;/FormField&gt;</code>.
          1:1 with LifeSG&rsquo;s <code>Form.CustomField</code> shape.
        </li>
        <li>
          <strong>Field</strong> — headless composition. See <a href="/form/field/introduction">Field</a>.
        </li>
      </ul>
      <h2>What we dropped</h2>
      <ul>
        <li>
          <strong>Responsive grid columns</strong> (<code>xxsCols</code>...<code>xxlCols</code> + <code>layoutType=&quot;grid&quot;</code>).
          Wrap with <code>&lt;Layout.ColDiv&gt;</code> from <code>@/components/ui/layout</code> for grid placement.
        </li>
        <li>
          <strong>Label addons</strong> (tooltip / popover icon adjacent to label text). Niche; compose with <code>&lt;Tooltip&gt;</code> if needed.
        </li>
      </ul>
    </Prose>
  );
}

export function FieldIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">Field</h1>
      <p>
        Headless wrapper composing <code>&lt;FieldLabel&gt;</code>, <code>&lt;FieldDescription&gt;</code>,
        a control (any input), and <code>&lt;FieldError&gt;</code>. Backed by{" "}
        <code>@base-ui/react/field</code> for automatic <code>htmlFor</code>/<code>aria-describedby</code> wiring,
        validity state, and disabled propagation.
      </p>
      <h2>Canonical shape</h2>
      <pre className="my-3 rounded bg-muted p-3 text-xs leading-relaxed overflow-x-auto"><code>{`<Field>
  <FieldLabel>Email</FieldLabel>
  <FieldDescription>We'll never share it.</FieldDescription>
  <Input type="email" />
  {error && <FieldError>{error}</FieldError>}
</Field>`}</code></pre>
      <h2>What we kept from LifeSG</h2>
      <ul>
        <li>Label color/weight/size matches LifeSG&rsquo;s FormLabel (HeadingXS — 18px / 600).</li>
        <li>Error message renders with a leading icon + red text matching LifeSG visually.</li>
        <li>Disabled state propagates from Field to children (label, description, control all dim).</li>
      </ul>
      <h2>What we dropped or deferred</h2>
      <ul>
        <li><strong>Label addons</strong> (tooltip / popover triggers next to the label text). Niche flourish; users can compose with <code>&lt;Tooltip&gt;</code> manually if needed.</li>
        <li><strong>FormWrapper&rsquo;s grid columns</strong> (xxsCols/xsCols/.../xxlCols + layoutType=&quot;grid&quot;). Layout responsibility moves to the parent <code>&lt;Layout.ColDiv&gt;</code>.</li>
        <li><strong>Built-in subtitle</strong> on Label. Use <code>&lt;FieldDescription&gt;</code> for the same purpose.</li>
      </ul>
      <h2>Standalone Label</h2>
      <p>
        For label use outside Field context (raw form-less labels), import{" "}
        <code>&lt;Label&gt;</code> from <code>@/components/ui/label</code>. Same visual styling,
        manual <code>htmlFor</code>.
      </p>
    </Prose>
  );
}

export function InputIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">Input</h1>
      <p>
        A single-line text input wrapping <code>@base-ui/react/input</code> for automatic Field
        context awareness (id, validity, disabled propagation). Two shapes:{" "}
        <code>&lt;Input&gt;</code> (raw) and <code>&lt;FormInput&gt;</code> (with label + error baked in).
      </p>
      <h2>What we kept</h2>
      <ul>
        <li><strong>allowClear + onClear</strong> — X button appears when value is non-empty.</li>
        <li><strong>readOnly</strong> renders with a muted background to differentiate from editable.</li>
        <li><strong>aria-invalid</strong> wires through to the error styling automatically (FormInput sets it from <code>errorMessage</code>).</li>
      </ul>
      <h2>What we dropped</h2>
      <ul>
        <li><code>spacing</code> prop (LifeSG&rsquo;s tel-only digit-spacing). Use{" "}
            <code>letter-spacing</code> in className if needed for tel layouts.</li>
        <li><code>styleType=&quot;no-border&quot;</code> — apply <code>className=&quot;border-0&quot;</code> directly.</li>
      </ul>
    </Prose>
  );
}

export function TextareaIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">Textarea</h1>
      <p>
        A multi-line text input. Native <code>&lt;textarea&gt;</code> styled with the same input
        tokens; no Base UI primitive needed.
      </p>
      <h2>What we kept</h2>
      <ul>
        <li><strong>showCounter</strong> + <code>maxLength</code> — renders a live <code>n / max</code> counter beneath the field.</li>
        <li><strong>resize-y</strong> — vertical-only resize handle (matches LifeSG).</li>
      </ul>
      <h2>What we dropped or deferred</h2>
      <ul>
        <li><code>transformValue</code> — apply normalization in <code>onChange</code> at the call site.</li>
        <li><code>renderCustomCounter</code> — wrap your own counter UI manually if needed.</li>
        <li><code>prefix</code> — use <code>InputGroup</code> + <code>InputGroupAddon</code> if you need a prefix on a textarea.</li>
      </ul>
    </Prose>
  );
}

export function MaskedInputIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">MaskedInput</h1>
      <p>
        A text input that hides characters behind a mask glyph until the user toggles them visible
        with the eye icon. Uses our <code>&lt;Input&gt;</code> as the base.
      </p>
      <h2>Mask configuration (one of)</h2>
      <ul>
        <li><code>maskRange={`{[start, end)}`}</code> — mask characters at indices in the range. Example: NRIC <code>S••••567A</code> via <code>[1, 5]</code>.</li>
        <li><code>unmaskRange={`{[start, end)}`}</code> — show characters in the range, mask everything else. Example: card last-4 only.</li>
        <li><code>maskRegex</code> — mask any character matching the regex.</li>
        <li>None of the above — entire value is masked (default password behaviour).</li>
      </ul>
      <h2>What we dropped or deferred</h2>
      <ul>
        <li><code>loadState</code> + <code>onTryAgain</code> (loading / fail / success states for readOnly mode with retry button). Defer until a real consumer needs the loading-then-revealed pattern.</li>
        <li><code>maskTransformer</code> — custom transform callback. Compose your own if needed.</li>
        <li><code>transformInput</code> (uppercase / lowercase). Do this in <code>onChange</code> at the call site.</li>
        <li><code>iconActiveColor</code> / <code>iconInactiveColor</code>. Pass any node via <code>iconMask</code> / <code>iconUnmask</code> with your own className.</li>
      </ul>
    </Prose>
  );
}

export function SelectIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">Select</h1>
      <p>
        Single-option dropdown built on <code>@base-ui/react/select</code>. Trigger button shows
        the current label; popup shows the option list with a check indicator on the selected row.
      </p>
      <h2>What we kept</h2>
      <ul>
        <li>Generic option shape via <code>valueExtractor</code> / <code>listExtractor</code>. Default extractors assume <code>{`{ value, label }`}</code> shape.</li>
        <li><code>onSelectOption(option, value)</code> signature matches LifeSG.</li>
        <li>Portal-based popup with focus trap, Escape, outside-click via Base UI.</li>
        <li>Keyboard nav: type-ahead, Arrow keys, Home/End, Enter/Space.</li>
      </ul>
      <h2>What we deferred</h2>
      <ul>
        <li><code>enableSearch</code> — Base UI Select doesn&rsquo;t ship a built-in search input. For searchable selects, swap to <code>@base-ui/react/combobox</code> when needed.</li>
        <li><code>renderListItem</code>, <code>renderCustomSelectedOption</code> — custom rendering. Compose by passing JSX into <code>listExtractor</code> for now (returns string only today).</li>
        <li><code>optionsLoadState</code> + <code>onRetry</code> — async load + error retry. Add when a real consumer exercises it.</li>
        <li><code>dropdownZIndex</code>, <code>dropdownRootNode</code>, <code>dropdownWidth</code> — defer.</li>
        <li><code>variant</code>, <code>alignment</code>, <code>optionTruncationType</code>, <code>customLabels</code> — defer.</li>
      </ul>
    </Prose>
  );
}

export function MultiSelectIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">MultiSelect</h1>
      <p>
        Multi-option dropdown built on <code>@base-ui/react/select</code> with{" "}
        <code>multiple={`{true}`}</code>. Same primitive as <a href="/form/select/introduction">Select</a> —
        the only differences are the array <code>value</code>, checkbox-style indicators, and a
        summary in the trigger.
      </p>
      <h2>Trigger summary behaviour</h2>
      <ul>
        <li>0 selected → placeholder.</li>
        <li>1 selected → that option&rsquo;s label.</li>
        <li>2+ selected → <code>N selected</code>. Override via <code>formatSummary(count, labels)</code>.</li>
      </ul>
      <h2>What we kept</h2>
      <ul>
        <li>Generic <code>{`<T, V>`}</code> option shapes via extractors.</li>
        <li><code>maxSelectable</code> — selection that would exceed the cap is silently rejected (LifeSG behaviour).</li>
        <li>Native checkbox-shaped indicators (vs Select&rsquo;s check icon).</li>
      </ul>
      <h2>What we deferred</h2>
      <ul>
        <li>Same as Select: <code>enableSearch</code>, custom rendering, load state, dropdown positioning props, custom labels.</li>
        <li><code>hideNoResultsDisplay</code>, <code>noResultsDescription</code> — only meaningful with search, deferred.</li>
      </ul>
    </Prose>
  );
}

export function DateInputIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">DateInput</h1>
      <p>
        Calendar dropdown for single date selection. Trigger button looks like an Input; click
        opens a Popover with our <code>&lt;Calendar&gt;</code> inside. Value format is{" "}
        <code>YYYY-MM-DD</code> matching LifeSG; trigger displays a friendlier{" "}
        <code>D MMM YYYY</code>.
      </p>
      <h2>What we kept</h2>
      <ul>
        <li><code>YYYY-MM-DD</code> string value (no Date objects, no timezone surprises).</li>
        <li><code>minDate</code> / <code>maxDate</code> / <code>disabledDates</code>.</li>
        <li><code>withButton</code> — Cancel + Done; selection only commits on Done.</li>
        <li>Popover handles Escape, outside-click, focus restoration via Base UI.</li>
      </ul>
      <h2>What we deferred</h2>
      <ul>
        <li><code>hideInputKeyboard</code>, <code>onYearMonthDisplayChange</code>,{" "}
          <code>dropdownRootNode</code>, <code>zIndex</code> — surface when a screen needs them.</li>
        <li>Year/month dropdown jump (matches our Calendar deferral noted in the Selection-and-Input batch).</li>
      </ul>
    </Prose>
  );
}

export function DateRangeInputIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">DateRangeInput</h1>
      <p>
        Calendar dropdown for date-range selection. Uses{" "}
        <code>react-day-picker</code>&rsquo;s <code>mode=&quot;range&quot;</code> directly inside a
        Popover (vs DateInput which wraps our <code>&lt;Calendar&gt;</code> single-mode).
      </p>
      <h2>What we kept</h2>
      <ul>
        <li>Dual <code>value</code> / <code>valueEnd</code> props matching LifeSG&rsquo;s shape.</li>
        <li><code>onChange(start, end)</code> signature.</li>
        <li>Range middle styled with the calendar hover token for the connecting band.</li>
      </ul>
      <h2>What we deferred</h2>
      <ul>
        <li><code>variant=&quot;fixed-range&quot;</code> + <code>numberOfDays</code> (LifeSG&rsquo;s
          fixed-length range mode). Add when a real consumer needs it.</li>
        <li><code>withButton</code>, <code>hideInputKeyboard</code>, <code>onYearMonthDisplayChange</code>,
          <code>dropdownRootNode</code>, <code>zIndex</code> — same as DateInput.</li>
      </ul>
    </Prose>
  );
}

export function PhoneNumberInputIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">PhoneNumberInput</h1>
      <p>
        Country-code dropdown + telephone-number input. Composite value{" "}
        <code>{`{ countryCode, number }`}</code> matching LifeSG&rsquo;s shape exactly. The country
        dropdown is built on <code>@base-ui/react/popover</code>.
      </p>
      <h2>What we kept</h2>
      <ul>
        <li>Composite <code>value</code> shape: <code>{`{ countryCode: "+65", number: "91234567" }`}</code>.</li>
        <li><code>fixedCountry</code> locks the country dropdown.</li>
        <li><code>autoComplete=&quot;tel&quot;</code> + <code>inputMode=&quot;tel&quot;</code> for native browser hints.</li>
        <li>Aria-labelled country trigger.</li>
      </ul>
      <h2>What we deferred or diverged on</h2>
      <ul>
        <li>
          <strong>Country list is a pilot-only minimal set</strong> (~20 SE Asian + common). LifeSG
          ships a full ITU country list with regional grouping. Pass{" "}
          <code>countries={`{customList}`}</code> to override; production should source from{" "}
          <code>libphonenumber-js</code> or similar.
        </li>
        <li><strong>Search inside the dropdown</strong> not implemented — defer until country list
          grows past ~30 entries.</li>
        <li><strong>Country flags</strong> not rendered — Lucide doesn&rsquo;t ship them and we
          haven&rsquo;t bundled flag SVGs.</li>
        <li><code>onShowOptions</code> / <code>onHideOptions</code> / <code>getAriaLabel</code> not
          surfaced — file an issue when needed.</li>
      </ul>
    </Prose>
  );
}

export function UnitNumberInputIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">UnitNumberInput</h1>
      <p>
        Two-part input for Singapore building unit numbers (floor + unit), separated by a dash.
        Output: <code>&quot;12-345&quot;</code>. Auto-tabs from floor to unit when the floor field
        is full.
      </p>
      <h2>What we kept</h2>
      <ul>
        <li><strong>Dual onChange callbacks</strong>: <code>onChange(formatted)</code> and{" "}
          <code>onChangeRaw([floor, unit])</code> fire in parallel — same for <code>onBlur</code>.</li>
        <li><code>inputMode=&quot;numeric&quot;</code> for mobile keyboard hints.</li>
        <li><code>maxLength</code> caps: 4 digits floor, 5 chars unit (matches HDB/condo conventions).</li>
        <li>Per-input <code>aria-label</code> + name suffixes (<code>name-floor</code>,{" "}
          <code>name-unit</code>) when <code>name</code> is set, for form-submission disambiguation.</li>
      </ul>
      <h2>Notes</h2>
      <ul>
        <li>Both controlled (<code>value</code>) and uncontrolled (<code>defaultValue</code>) modes supported.</li>
        <li>Each input is independently navigable via Tab. No auto-advance from floor to unit (LifeSG also doesn&rsquo;t auto-advance — the &quot;-&quot; separator is purely visual).</li>
      </ul>
    </Prose>
  );
}

export function InputGroupIntro() {
  return (
    <Prose>
      <h1 className="text-2xl font-semibold tracking-tight">InputGroup</h1>
      <p>
        An input with one or more bordered addons (label, currency symbol, action button) on the
        left or right. Composition primitives: <code>&lt;InputGroup&gt;</code> as the bordered shell,
        <code>&lt;InputGroupAddon&gt;</code> for adjacent content, <code>&lt;InputGroupInput&gt;</code> for the input slot.
      </p>
      <h2>Composition shape (vs LifeSG&rsquo;s addon prop)</h2>
      <p>
        LifeSG&rsquo;s <code>&lt;InputGroup&gt;</code> takes one nested <code>addon</code> object configuring
        position, type (<code>label</code> / <code>list</code> / <code>custom</code>), and a complex
        list-options shape. Our composition is more verbose but accepts any JSX, supports{" "}
        <strong>multiple addons</strong> (left + right), and lets the input slot be anything that
        looks like an input.
      </p>
      <h2>What we deferred</h2>
      <ul>
        <li><strong>list addon</strong> (the dropdown-on-the-side variant). Compose with our <code>&lt;Select&gt;</code> as a trigger if needed; otherwise wait for a real consumer.</li>
        <li><strong>allowClear / onClear at group level</strong>. Add an X-button addon manually with the right onClick.</li>
      </ul>
    </Prose>
  );
}
