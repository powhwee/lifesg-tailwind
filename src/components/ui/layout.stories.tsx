import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Section, Container, Content, ColDiv } from "./layout";

const meta: Meta<typeof Container> = {
  title: "Core/Layout",
  component: Container,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Container>;

const SYSTEM_DEMO_HEIGHT = 360;
const sectionWashStyle = {
  backgroundColor: "#FDDDD7",
  minHeight: SYSTEM_DEMO_HEIGHT,
} as const;
const cellWashStyle = {
  backgroundColor: "#F9B5B2",
  minHeight: SYSTEM_DEMO_HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#7B2A26",
  fontWeight: 600,
} as const;

// LifeSG-style system tours — two coral shades make the Container's
// max-width + horizontal padding visible at a glance. Mirrors the
// canonical Storybook at https://designsystem.life.gov.sg/react.
export const FlexLayout: Story = {
  render: () => (
    <div style={sectionWashStyle}>
      <Container>
        <div style={{ ...cellWashStyle, flex: 1 }} />
      </Container>
    </div>
  ),
};

export const FlexColumnLayout: Story = {
  render: () => (
    <div style={sectionWashStyle}>
      <Container type="flex-column">
        <div style={cellWashStyle}>First item</div>
        <div style={cellWashStyle}>Second item</div>
      </Container>
    </div>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <div style={sectionWashStyle}>
      <Container type="grid">
        {Array.from({ length: 12 }, (_, i) => (
          <ColDiv key={i} xxsCols={1}>
            <div style={cellWashStyle}>{i + 1}</div>
          </ColDiv>
        ))}
      </Container>
    </div>
  ),
};

export const Stretch: Story = {
  render: () => (
    <div style={sectionWashStyle}>
      <Container stretch>
        <div style={{ ...cellWashStyle, flex: 1 }} />
      </Container>
    </div>
  ),
};

// API-focused examples — labeled cells that exercise each prop concretely.
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
