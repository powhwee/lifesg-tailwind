import type { Meta, StoryObj } from "@storybook/react";
import { Container, ColDiv } from "./layout";

// System tour — mirrors the canonical LifeSG Storybook at
// https://designsystem.life.gov.sg/react. Two coral shades on the outer
// wash and the Container's children make max-width, horizontal padding,
// and the 12-column grid visible at a glance. These stories are pure
// visualisation: the API surface (props, span syntax, Section nesting)
// lives in layout.stories.tsx so each concern is editable in one place.

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

const meta: Meta<typeof Container> = {
  title: "Core/Layout/System Tour",
  component: Container,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const FlexLayout: Story = {
  render: () => (
    <div style={sectionWashStyle}>
      <Container>
        <div style={{ ...cellWashStyle, flex: 1 }} />
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Container>
  {/* children flow as flex items with the design-system gutter */}
</Container>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Container type="flex-column">
  {/* children stack vertically with the design-system gutter */}
</Container>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Container type="grid">
  {Array.from({ length: 12 }, (_, i) => (
    <ColDiv key={i} xxsCols={1}>
      {/* one ColDiv per grid column */}
    </ColDiv>
  ))}
</Container>`,
      },
    },
  },
};

export const Stretch: Story = {
  render: () => (
    <div style={sectionWashStyle}>
      <Container stretch>
        <div style={{ ...cellWashStyle, flex: 1 }} />
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Container stretch>
  {/* edge-to-edge: max-width constraint removed */}
</Container>`,
      },
    },
  },
};
