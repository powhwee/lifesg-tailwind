import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Section, Container, Content, ColDiv } from "./layout";

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

export const FlexContainer: Story = {
  render: () => (
    <Container>
      <Cell>Item A</Cell>
      <Cell>Item B</Cell>
      <Cell>Item C</Cell>
    </Container>
  ),
};

export const FlexColumnContainer: Story = {
  render: () => (
    <Container type="flex-column">
      <Cell>Row 1</Cell>
      <Cell>Row 2</Cell>
      <Cell>Row 3</Cell>
    </Container>
  ),
};

export const GridWithColDivs: Story = {
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
  render: () => (
    <Container type="grid">
      <ColDiv smCols={[1, -1]}>
        <Cell>Spans every column on every breakpoint</Cell>
      </ColDiv>
    </Container>
  ),
};

export const SectionWithContent: Story = {
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

export const StretchToEdge: Story = {
  render: () => (
    <Container stretch>
      <Cell>Edge-to-edge: max-width is removed</Cell>
    </Container>
  ),
};
