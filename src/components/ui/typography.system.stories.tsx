import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

// System tour — visualises the full LifeSG typography ramp (10 variants
// × 4 weights). Mirrors the canonical Storybook's "Typography Set" /
// scale-tour stories. The API examples (Default, LineClamp) live in
// typography.stories.tsx so each concern is editable in one place.

const meta: Meta<typeof Typography> = {
  title: "Core/Typography/System Tour",
  component: Typography,
};

export default meta;
type Story = StoryObj<typeof Typography>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[120px_1fr] items-baseline gap-6 border-b border-lifesg-border py-3">
    <div className="text-xs font-mono text-lifesg-text-subtle uppercase tracking-wide">
      {label}
    </div>
    <div>{children}</div>
  </div>
);

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="heading-xxl"><Typography variant="heading-xxl">The quick brown fox</Typography></Row>
      <Row label="heading-xl"><Typography variant="heading-xl">The quick brown fox</Typography></Row>
      <Row label="heading-lg"><Typography variant="heading-lg">The quick brown fox</Typography></Row>
      <Row label="heading-md"><Typography variant="heading-md">The quick brown fox</Typography></Row>
      <Row label="heading-sm"><Typography variant="heading-sm">The quick brown fox</Typography></Row>
      <Row label="heading-xs"><Typography variant="heading-xs">The quick brown fox</Typography></Row>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: "tsx",
        code: `<Typography variant="heading-xxl">…</Typography>
// Six heading sizes: heading-xxl, heading-xl, heading-lg,
// heading-md, heading-sm, heading-xs`,
      },
    },
  },
};

export const Body: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="body-bl">
        <Typography variant="body-bl">
          The quick brown fox jumps over the lazy dog. Body BL — extra-large callout text.
        </Typography>
      </Row>
      <Row label="body-md">
        <Typography variant="body-md">
          The quick brown fox jumps over the lazy dog. Body MD — standard body copy.
        </Typography>
      </Row>
      <Row label="body-sm">
        <Typography variant="body-sm">
          The quick brown fox jumps over the lazy dog. Body SM — spacious 26 px line-height,
          differs from Tailwind's text-sm default of 20.
        </Typography>
      </Row>
      <Row label="body-xs">
        <Typography variant="body-xs">
          The quick brown fox jumps over the lazy dog. Body XS — captions and helper text.
        </Typography>
      </Row>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: "tsx",
        code: `<Typography variant="body-md">…</Typography>
// Four body sizes: body-bl, body-md, body-sm, body-xs`,
      },
    },
  },
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="light">
        <Typography variant="body-md" weight="light">The quick brown fox jumps over the lazy dog.</Typography>
      </Row>
      <Row label="regular">
        <Typography variant="body-md" weight="regular">The quick brown fox jumps over the lazy dog.</Typography>
      </Row>
      <Row label="semibold">
        <Typography variant="body-md" weight="semibold">The quick brown fox jumps over the lazy dog.</Typography>
      </Row>
      <Row label="bold">
        <Typography variant="body-md" weight="bold">The quick brown fox jumps over the lazy dog.</Typography>
      </Row>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: "tsx",
        code: `<Typography weight="semibold">…</Typography>
// Four weights: light (300), regular (400), semibold (600), bold (700)`,
      },
    },
  },
};

export const TypographySet: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="heading-xxl"><Typography variant="heading-xxl" weight="bold">Heading XXL</Typography></Row>
      <Row label="heading-xl"><Typography variant="heading-xl" weight="bold">Heading XL</Typography></Row>
      <Row label="heading-lg"><Typography variant="heading-lg" weight="bold">Heading LG</Typography></Row>
      <Row label="heading-md"><Typography variant="heading-md" weight="bold">Heading MD</Typography></Row>
      <Row label="heading-sm"><Typography variant="heading-sm" weight="bold">Heading SM</Typography></Row>
      <Row label="heading-xs"><Typography variant="heading-xs" weight="bold">Heading XS</Typography></Row>
      <Row label="body-bl"><Typography variant="body-bl">Body BL — extra large body copy.</Typography></Row>
      <Row label="body-md"><Typography variant="body-md">Body MD — standard copy.</Typography></Row>
      <Row label="body-sm"><Typography variant="body-sm">Body SM — smaller copy with spacious leading.</Typography></Row>
      <Row label="body-xs"><Typography variant="body-xs">Body XS — captions and helper text.</Typography></Row>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: "tsx",
        code: `// The full LifeSG type ramp — pick a variant per use:
//
//   Heading variants: heading-xxl (30/38) → heading-xs (16/24)
//   Body variants:    body-bl (18/28)     → body-xs   (12/20)
//   Weights:          light / regular / semibold / bold
<Typography variant="heading-lg" weight="bold">Title</Typography>
<Typography variant="body-md">Copy</Typography>`,
      },
    },
  },
};
