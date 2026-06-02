import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Section, Container, Content, ColDiv } from "./layout";

// API-focused examples — labeled cells that exercise each prop
// concretely. The LifeSG-style visual system tour lives in
// layout.system.stories.tsx so each concern stays editable in one place.

const meta: Meta<typeof Container> = {
  title: "Core/Layout",
  component: Container,
};

export default meta;
type Story = StoryObj<typeof Container>;

const Cell = ({ children }: { children: ReactNode }) => (
  <div className="bg-lifesg-bg-subtle border border-lifesg-border px-3 py-2 text-sm">
    {children}
  </div>
);

export const GridWithColDivs: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Container type="grid">
      <ColDiv smCols={2} mdCols={4} lgCols={6}>
        <Cell>Sidebar (2 / 4 / 6 cols)</Cell>
      </ColDiv>
      <ColDiv smCols={2} mdCols={4} lgCols={6}>
        <Cell>Main (2 / 4 / 6 cols)</Cell>
      </ColDiv>
    </Container>
  ),
};

export const FullSpanCol: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Container type="grid">
      <ColDiv smCols={[1, -1]}>
        <Cell>Spans every column on every breakpoint</Cell>
      </ColDiv>
    </Container>
  ),
};

export const SectionWithContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Section>
      <Content type="flex-column">
        <Cell>Content row 1 — nested inside Section</Cell>
        <Cell>Content row 2</Cell>
        <Cell>Content row 3</Cell>
      </Content>
    </Section>
  ),
};
