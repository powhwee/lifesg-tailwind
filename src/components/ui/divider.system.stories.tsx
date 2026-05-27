import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";
import { Stack } from "@/components/storybook-common";

// System tour — visualises divider thickness scale and integration
// patterns within a grid. Mirrors LifeSG's canonical Storybook stories
// ("Using In Grid Layout" / "Setting Grid Columns"). The per-prop API
// examples (Default, Dashed, CustomColor) live in divider.stories.tsx.

const meta: Meta<typeof Divider> = {
  title: "Core/Divider/System Tour",
  component: Divider,
};

export default meta;
type Story = StoryObj<typeof Divider>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[80px_1fr] items-center gap-6">
    <div className="text-xs font-mono text-lifesg-text-subtle uppercase tracking-wide">
      {label}
    </div>
    <div>{children}</div>
  </div>
);

export const ThicknessScale: Story = {
  render: () => (
    <Stack gap={6} className="w-[28rem]">
      <Row label="1px"><Divider thickness={1} /></Row>
      <Row label="2px"><Divider thickness={2} /></Row>
      <Row label="3px"><Divider thickness={3} /></Row>
      <Row label="4px"><Divider thickness={4} /></Row>
      <Row label="6px"><Divider thickness={6} /></Row>
      <Row label="8px"><Divider thickness={8} /></Row>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Divider thickness={2} />
// thickness accepts any CSS length; LifeSG usage caps at 1–8 px`,
      },
    },
  },
};

export const LineStyles: Story = {
  render: () => (
    <Stack gap={6} className="w-[28rem]">
      <Row label="solid"><Divider lineStyle="solid" /></Row>
      <Row label="dashed"><Divider lineStyle="dashed" /></Row>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Divider lineStyle="solid" />
<Divider lineStyle="dashed" />`,
      },
    },
  },
};

export const UsingInGridLayout: Story = {
  render: () => (
    <div className="w-[40rem] grid grid-cols-3 gap-6 items-center">
      <div className="text-sm">Section A</div>
      <div><Divider /></div>
      <div className="text-sm">Section B</div>
      <div className="text-sm">Section C</div>
      <div><Divider thickness={2} /></div>
      <div className="text-sm">Section D</div>
      <div className="text-sm">Section E</div>
      <div><Divider lineStyle="dashed" /></div>
      <div className="text-sm">Section F</div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<div className="grid grid-cols-3 gap-6 items-center">
  <div>Section A</div>
  <div><Divider /></div>
  <div>Section B</div>
</div>`,
      },
    },
  },
};

export const VerticalStack: Story = {
  render: () => (
    <Stack gap={4} className="w-[24rem]">
      <div className="rounded-card border border-card-border p-4">
        <div className="text-component-body leading-component-body">List item 1</div>
        <Divider className="mt-3" />
      </div>
      <div className="rounded-card border border-card-border p-4">
        <div className="text-component-body leading-component-body">List item 2</div>
        <Divider className="mt-3" thickness={2} />
      </div>
      <div className="rounded-card border border-card-border p-4">
        <div className="text-component-body leading-component-body">List item 3</div>
        <Divider className="mt-3" lineStyle="dashed" />
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<div className="rounded-card border p-4">
  Item content
  <Divider className="mt-3" />
</div>`,
      },
    },
  },
};
