# Next.js App Router: LifeSG v3.x vs v4 Alpha vs Tailwind Port

## Context

This document compares the developer experience of building a feature page in Next.js App Router using three approaches:

- **LifeSG v3.x** (`@lifesg/react-design-system ^3.4.0-canary.3`): the version the team currently uses
- **LifeSG v4 Alpha**: the upcoming version with CSS variable-based tokens
- **Tailwind v4 + Base UI port**: this repository

The example is a mid-complexity Job Application page for CareerNav, touching layout, forms, overlays, and data fetching.

### Caveats

- The LifeSG approach shown here represents a **worst-case pattern** where the developer places all LifeSG components in a single client file. In practice, experienced developers can split client boundaries more carefully — the issue is that `styled-components` makes this splitting harder, not impossible.
- `styled-components` v6 does support SSR via `ServerStyleSheet`. The HTML is server-rendered and styled on first paint — the user does not see a blank white page. The cost is hydration overhead and bundle size, not a broken initial render.
- LifeSG's monolithic `Form.Input` API is a trade-off: less flexibility, but also less boilerplate for standard forms. For teams that don't need custom layouts, it's genuinely faster to write.

---

## How v3.x Differs from v4

The team currently uses v3.x (`^3.4.0-canary.3`). This is relevant because v3.x is more tightly coupled to `styled-components` than v4.

In **v3.x**, every design token is a **JavaScript function** that reads from the `styled-components` theme context at render time:

```ts
// v3.x — every colour token is a function
"brand-10": (props: StyledComponentProps) => string;
"primary-50": (props: StyledComponentProps) => string;
```

Inside each component, tokens are resolved like this:

```ts
// v3.x button internals (from node_modules)
padding: ${co["spacing-8"]} ${co["spacing-16"]};
border: ${bo["width-010"]} ${bo.solid} transparent;
transition: all ${go["duration-250"]} ${go["ease-default"]};
```

Every token value (`co["spacing-8"]`, `bo["width-010"]`, `go["duration-250"]`) is a function call that reads from `props.theme` at runtime. This means:

1. **Tokens are JavaScript, not CSS.** Changing a colour requires the React tree to re-render so `styled-components` can re-evaluate the functions and generate new CSS classes. In v4, tokens are CSS variables (`--fds-primary-50`), so a theme change is just a CSS property swap — no React re-render needed.

2. **No CSS variable fallback.** In v3.x, if the `ThemeProvider` is missing or misconfigured, tokens return `undefined` and components render with broken styles (missing colours, no spacing). There is no CSS-level fallback. v4's CSS variables can at least have a `var(--fds-x, fallback)` default.

3. **Heavier runtime cost.** Every `styled-components` template literal in v3.x contains function interpolations that execute on every render. v4 reduces this by moving static values to CSS variables, keeping only dynamic/conditional styles in JavaScript.

In practice, the code a **feature developer** writes looks the same between v3.x and v4 — the LifeSG component API (`<Form.Input>`, `<Button.Default>`, etc.) hasn't changed. The difference is internal to the design system package. The v4 changes improve theming performance but don't change the `styled-components` dependency or the `'use client'` constraint.

The comparison examples below apply to both v3.x and v4, since the developer-facing API and the `styled-components` requirement are the same.

---

## The Feature

A developer needs to build:
- A page with Navbar + Footer (layout)
- A multi-field form (name, email, phone, job category select, start date)
- Client-side validation with error messages
- A confirmation modal on submit
- An error display if the API call fails

---

## Approach A: LifeSG v4 + Next.js App Router

### Root Layout

LifeSG requires a `ThemeProvider` wrapping the component tree. This provider uses React Context, which requires `'use client'`:

```tsx
// app/layout.tsx
import { LifeSGProviderWrapper } from "@/components/lifesg-provider-wrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LifeSGProviderWrapper>
          {children}
        </LifeSGProviderWrapper>
      </body>
    </html>
  );
}
```

```tsx
// components/lifesg-provider-wrapper.tsx
"use client"; // Required — ThemeProvider uses React Context

import { LifeSGProvider } from "@lifesg/react-design-system";
import { BaseTheme } from "@lifesg/react-design-system/theme";

export function LifeSGProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LifeSGProvider theme={BaseTheme}>
      {children}
    </LifeSGProvider>
  );
}
```

The `'use client'` wrapper at the root means all components inside the provider are within the client boundary. React will still server-render the HTML, but the entire tree requires hydration on the client side.

### The Page

```tsx
// app/jobs/[id]/apply/page.tsx
import { ApplicationForm } from "@/components/jobs/application-form";
import { getJobDetails } from "@/lib/api";

export default async function ApplyPage({ params }: { params: { id: string } }) {
  // Data fetching happens on the server
  const job = await getJobDetails(params.id);

  // Rendering delegates to a client component because LifeSG
  // components require the styled-components runtime
  return <ApplicationForm job={job} />;
}
```

```tsx
// components/jobs/application-form.tsx
"use client"; // Required — all LifeSG imports use styled-components

import { useState } from "react";
import { Form } from "@lifesg/react-design-system/form";
import { Layout } from "@lifesg/react-design-system/layout";
import { Navbar } from "@lifesg/react-design-system/navbar";
import { Footer } from "@lifesg/react-design-system/footer";
import { Modal } from "@lifesg/react-design-system/modal";
import { Button } from "@lifesg/react-design-system/button";
import { ErrorDisplay } from "@lifesg/react-design-system/error-display";
import { Text } from "@lifesg/react-design-system/text";

interface Job {
  id: string;
  title: string;
  company: string;
  categories: { value: string; label: string }[];
}

export function ApplicationForm({ job }: { job: Job }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    startDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/apply`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submission failed");
      setShowConfirm(false);
    } catch (e) {
      setSubmitError("Something went wrong. Please try again.");
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Navbar, Layout, headings, and Footer are static content but
          must be in a client component file because they use
          styled-components internally */}
      <Navbar
        title="CareerNav"
        items={[
          { id: "jobs", children: "Jobs", href: "/jobs" },
          { id: "profile", children: "Profile", href: "/profile" },
        ]}
      />

      <Layout.Content>
        <Layout.Section>
          <Text.H1>Apply for {job.title}</Text.H1>
          <Text.Body>at {job.company}</Text.Body>

          {submitError && (
            <ErrorDisplay
              type="warning"
              title="Submission Error"
              description={submitError}
            />
          )}

          {/* Form.Input bundles label, input, error message, and
              grid layout into a single component. This reduces
              boilerplate but limits layout flexibility. */}
          <Form.Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
            errorMessage={errors.name}
          />

          <Form.Input
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
            errorMessage={errors.email}
          />

          <Form.Input
            label="Phone Number"
            placeholder="+65 9123 4567"
            value={formData.phone}
            onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
            errorMessage={errors.phone}
          />

          <Form.Select
            label="Job Category"
            placeholder="Select a category"
            options={job.categories}
            selectedOption={formData.category}
            onSelectOption={(opt) =>
              setFormData((d) => ({ ...d, category: opt }))
            }
            errorMessage={errors.category}
          />

          <Form.DateInput
            label="Earliest Start Date"
            value={formData.startDate}
            onChange={(val) => setFormData((d) => ({ ...d, startDate: val }))}
            errorMessage={errors.startDate}
          />

          <Button.Default
            onClick={() => {
              if (validate()) setShowConfirm(true);
            }}
          >
            Submit Application
          </Button.Default>
        </Layout.Section>
      </Layout.Content>

      <Modal.Default
        show={showConfirm}
        title="Confirm Submission"
        onClose={() => setShowConfirm(false)}
      >
        <Modal.Default.Body>
          <Text.Body>
            Submit your application for {job.title} at {job.company}?
          </Text.Body>
        </Modal.Default.Body>
        <Modal.Default.Footer>
          <Button.Secondary onClick={() => setShowConfirm(false)}>
            Cancel
          </Button.Secondary>
          <Button.Default onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button.Default>
        </Modal.Default.Footer>
      </Modal.Default>

      <Footer
        links={[
          { title: "Terms of Use", href: "/terms" },
          { title: "Privacy", href: "/privacy" },
        ]}
      />
    </>
  );
}
```

### What the browser processes

1. Server sends HTML (styled via SSR `ServerStyleSheet` — content is visible on first paint)
2. Browser downloads JS bundle: React + `styled-components` runtime + all LifeSG components + application code
3. `styled-components` runtime re-generates CSS class hashes during hydration
4. React hydrates the entire tree (navbar, headings, footer, form, modal)
5. Page becomes interactive

The page is **not blank** on first load (SSR handles that), but the hydration step processes the entire component tree including static elements that don't require interactivity.

---

## Approach B: Tailwind Port + Next.js App Router

### Root Layout — Server Component

```tsx
// app/layout.tsx — No 'use client', no provider wrapper needed
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar renders to HTML on the server.
            No JavaScript is shipped for this component. */}
        <Navbar
          title="CareerNav"
          items={[
            { id: "jobs", label: "Jobs", href: "/jobs" },
            { id: "profile", label: "Profile", href: "/profile" },
          ]}
        />
        <main>{children}</main>
        {/* Footer also renders as server HTML. */}
        <Footer
          links={[
            { title: "Terms of Use", href: "/terms" },
            { title: "Privacy", href: "/privacy" },
          ]}
        />
      </body>
    </html>
  );
}
```

### The Page — Server + Client Split

```tsx
// app/jobs/[id]/apply/page.tsx — Server Component
import { getJobDetails } from "@/lib/api";
import { Content, Section } from "@/components/ui/layout";
import { Typography } from "@/components/ui/typography";
import { ApplicationForm } from "./application-form";

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const job = await getJobDetails(params.id);

  return (
    <Content>
      <Section>
        {/* Static content renders as HTML on the server.
            No JavaScript is needed for these elements. */}
        <Typography as="h1" variant="heading-lg">
          Apply for {job.title}
        </Typography>
        <Typography as="p" variant="body">
          at {job.company}
        </Typography>

        {/* Only the interactive form crosses the client boundary */}
        <ApplicationForm job={job} />
      </Section>
    </Content>
  );
}
```

```tsx
// app/jobs/[id]/apply/application-form.tsx
"use client"; // Only this file — contains form state and modal interaction

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DateInput } from "@/components/ui/date-input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Typography } from "@/components/ui/typography";

interface Job {
  id: string;
  title: string;
  company: string;
  categories: { value: string; label: string }[];
}

export function ApplicationForm({ job }: { job: Job }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    startDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/apply`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submission failed");
      setShowConfirm(false);
    } catch (e) {
      setSubmitError("Something went wrong. Please try again.");
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitError && (
        <ErrorDisplay
          type="warning"
          title="Submission Error"
          description={submitError}
        />
      )}

      {/* Field and Input are separate components. Field handles
          label and error wiring via Base UI. Input is the input.
          Layout is controlled by the developer, not baked into
          the component. */}
      <Field label="Full Name" error={errors.name}>
        <Input
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
        />
      </Field>

      <Field label="Email Address" error={errors.email}>
        <Input
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
        />
      </Field>

      <Field label="Phone Number" error={errors.phone}>
        <Input
          placeholder="+65 9123 4567"
          value={formData.phone}
          onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
        />
      </Field>

      <Field label="Job Category" error={errors.category}>
        <Select
          placeholder="Select a category"
          options={job.categories}
          value={formData.category}
          onValueChange={(val) => setFormData((d) => ({ ...d, category: val }))}
        />
      </Field>

      <Field label="Earliest Start Date" error={errors.startDate}>
        <DateInput
          value={formData.startDate}
          onChange={(val) => setFormData((d) => ({ ...d, startDate: val }))}
        />
      </Field>

      <Button onClick={() => { if (validate()) setShowConfirm(true); }}>
        Submit Application
      </Button>

      {/* Modal uses Base UI Dialog — focus trap, scroll lock,
          ESC-to-close are handled by the headless primitive */}
      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Submission"
      >
        <Typography as="p" variant="body">
          Submit your application for {job.title} at {job.company}?
        </Typography>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

### What the browser processes

1. Server sends fully styled HTML (Navbar, headings, Footer are already rendered with CSS classes applied)
2. Browser downloads JS bundle: React + only the form component code (no styling runtime, no layout/navbar/footer JS)
3. React hydrates only the `<ApplicationForm>` subtree
4. Page becomes interactive

---

## Form Code Side by Side

The form fields are the core of the page. Here is the JSX for each field, stripped of state logic, compared directly:

| LifeSG v3.x / v4 | Tailwind Port |
|---|---|
| `<Form.Input` | `<Field label="Full Name" error={errors.name}>` |
| `  label="Full Name"` | `  <Input` |
| `  placeholder="Enter your full name"` | `    placeholder="Enter your full name"` |
| `  value={formData.name}` | `    value={formData.name}` |
| `  onChange={handleChange}` | `    onChange={handleChange}` |
| `  errorMessage={errors.name}` | `  />` |
| `/>` | `</Field>` |

Both render: a label, a text input, and an error message below when validation fails. The visual output is the same.

**What differs:**

| | LifeSG | Tailwind Port |
|--|--------|---------------|
| **Label** | Baked into `Form.Input` via `label` prop | Rendered by `Field` via `label` prop |
| **Error** | Baked into `Form.Input` via `errorMessage` prop | Rendered by `Field` via `error` prop |
| **Input** | Baked into `Form.Input` (is the component) | Separate `Input` component nested inside `Field` |
| **Layout** | `Form.Input` internally wraps itself in a `ColDiv` (CSS grid-column positioning from LifeSG's Layout system) | `Field` uses `flex flex-col gap-1` — a flexbox column |
| **ARIA wiring** | Internal to `Form.Input` | Base UI `Field.Root` automatically links label → input via `htmlFor`/`id`, and error → input via `aria-describedby` |

**The Select field:**

| LifeSG v3.x / v4 | Tailwind Port |
|---|---|
| `<Form.Select` | `<Field label="Job Category" error={errors.category}>` |
| `  label="Job Category"` | `  <Select` |
| `  placeholder="Select a category"` | `    placeholder="Select a category"` |
| `  options={job.categories}` | `    options={job.categories}` |
| `  selectedOption={formData.category}` | `    value={formData.category}` |
| `  onSelectOption={handleSelect}` | `    onValueChange={handleSelect}` |
| `  errorMessage={errors.category}` | `  />` |
| `/>` | `</Field>` |

The LifeSG version is 1 component, 7 props. The Tailwind version is 2 components (Field wrapping Select), with label/error on the outer component and input props on the inner. Total props across both is the same.

---

## Comparison


| Aspect | LifeSG v4 + Next.js | Tailwind Port + Next.js |
|--------|-------------------|----------------------|
| **Root layout** | Requires `'use client'` wrapper for ThemeProvider | Server Component (no provider needed) |
| **Navbar / Footer** | Included in client bundle, hydrated | Server-rendered HTML, no JS shipped |
| **Static headings** | Part of client bundle, hydrated | Server-rendered, no JS shipped |
| **Form inputs** | `Form.Input` bundles label + input + error + grid | `Field` + `Input` are separate, layout is developer-controlled |
| **`'use client'` scope** | Covers the entire page content | Covers only the interactive form |
| **JS shipped to browser** | React + `styled-components` runtime + all component JS | React + form component JS only |
| **Initial render** | SSR provides styled HTML; hydration re-processes full tree | SSR provides styled HTML; hydration processes only the form |
| **Modal accessibility** | LifeSG's internal implementation | Base UI Dialog (maintained by MUI team) |

## File Structure Comparison

```
# LifeSG approach — wide client boundary
app/
  layout.tsx                          # Server, wraps LifeSGProvider (client)
  components/
    lifesg-provider-wrapper.tsx       # 'use client' — client boundary at root
  jobs/[id]/apply/
    page.tsx                          # Server — data fetch, delegates to:
    components/
      application-form.tsx            # 'use client' — navbar, footer, layout,
                                      #   headings, form, modal in one client file

# Tailwind port — narrow client boundary
app/
  layout.tsx                          # Server Component — navbar + footer here
  jobs/[id]/apply/
    page.tsx                          # Server Component — headings + layout here
    application-form.tsx              # 'use client' — form + modal only
```

## Where the Code Actually Goes

The total amount of code the developer writes is roughly the same in both approaches. The Tailwind port's `application-form.tsx` is smaller not because code was eliminated, but because it was distributed to other files:

| Code | LifeSG approach | Tailwind port |
|------|----------------|---------------|
| Navbar (~7 lines) | `application-form.tsx` (client) | `layout.tsx` (server) |
| Footer (~6 lines) | `application-form.tsx` (client) | `layout.tsx` (server) |
| Layout wrappers (~4 lines) | `application-form.tsx` (client) | `page.tsx` (server) |
| Headings (~4 lines) | `application-form.tsx` (client) | `page.tsx` (server) |
| Provider wrapper (~8 lines) | `lifesg-provider-wrapper.tsx` (client) | *(not needed)* |
| Form + modal (~100 lines) | `application-form.tsx` (client) | `application-form.tsx` (client) |

The only code that genuinely disappears is the `LifeSGProviderWrapper` (~8 lines). Everything else moves from a `'use client'` file to a server file.

## Key Takeaway

The developer-facing difference is not about writing less code. It is about where the `'use client'` boundary falls and how that affects file organisation.

With LifeSG v4, `styled-components` requires the client runtime for all visual components, which pulls static content (navbar, footer, headings) into the client boundary alongside interactive content (form, modal). The developer can work around this by splitting files, but the design system's dependency on `styled-components` makes the split harder.

With the Tailwind port, styling is resolved at build time via CSS classes. Static content naturally lives in server files, and the client boundary is drawn narrowly around components that require client-side state. The file structure reflects the actual interactivity boundary rather than the styling dependency.

Both approaches produce the same functional, styled page. The trade-off is in hydration scope (how much of the tree the browser re-processes), bundle size (how much JS is shipped), and whether the file organisation is driven by architectural intent or by the styling library's runtime requirements.
