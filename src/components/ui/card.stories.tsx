import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "Content/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Card className="w-80">
      <Card.Header>
        <Card.Title>Library card</Card.Title>
        <Card.Description>Use this for your next loan.</Card.Description>
      </Card.Header>
      <Card.Body>
        Membership number: <strong>NL-0048-2914</strong>
      </Card.Body>
    </Card>
  ),
};

export const TitleOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Card className="w-80">
      <Card.Title>Quick stat</Card.Title>
    </Card>
  ),
};

export const FullComposition: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Card className="w-96">
      <Card.Header>
        <Card.Title>Renew your CPF nomination</Card.Title>
        <Card.Description>
          Last updated 12 months ago.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        Nominating someone to receive your CPF savings means they will be paid
        in cash directly, instead of going through your estate. This usually
        speeds up payouts.
      </Card.Body>
      <Card.Footer>
        <Button variant="outline">Learn more</Button>
        <Button>Update nomination</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Stacked: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Card>
        <Card.Title>Singapore Citizen</Card.Title>
        <Card.Body>Eligible for full subsidies.</Card.Body>
      </Card>
      <Card>
        <Card.Title>Permanent Resident</Card.Title>
        <Card.Body>Eligible for partial subsidies.</Card.Body>
      </Card>
      <Card>
        <Card.Title>Foreigner</Card.Title>
        <Card.Body>Self-pay rates apply.</Card.Body>
      </Card>
    </div>
  ),
};
