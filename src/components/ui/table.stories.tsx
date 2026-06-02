import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./table";

const meta: Meta<typeof Table> = {
  title: "Content/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  { name: "Adult", price: "$12", duration: "All-day" },
  { name: "Child (3–12)", price: "$6", duration: "All-day" },
  { name: "Senior (60+)", price: "$8", duration: "All-day" },
  { name: "Family (2A + 2C)", price: "$30", duration: "All-day" },
];

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table.Container className="w-[36rem]">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Ticket type</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.name}>
              <Table.Cell>{r.name}</Table.Cell>
              <Table.Cell>{r.price}</Table.Cell>
              <Table.Cell>{r.duration}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
  ),
};

export const NumericAlignment: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table.Container className="w-[36rem]">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Bucket</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Count</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Share</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {[
            { b: "Singapore Citizen", c: 12_420, s: "62.1%" },
            { b: "Permanent Resident", c: 3_180, s: "15.9%" },
            { b: "Foreigner", c: 4_400, s: "22.0%" },
          ].map((r) => (
            <Table.Row key={r.b}>
              <Table.Cell>{r.b}</Table.Cell>
              <Table.Cell className="text-right tabular-nums">
                {r.c.toLocaleString()}
              </Table.Cell>
              <Table.Cell className="text-right tabular-nums">{r.s}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
  ),
};

export const LongContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table.Container className="w-[40rem]">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Programme</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Workfare</Table.Cell>
            <Table.Cell>
              Supplements the income of lower-wage Singaporean workers and
              provides them with retirement savings.
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>SkillsFuture Credit</Table.Cell>
            <Table.Cell>
              A non-expiring credit balance for working adults to offset the
              cost of approved skills-related courses.
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Table.Container>
  ),
};
