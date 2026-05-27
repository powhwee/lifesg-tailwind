import type { Meta, StoryObj } from "@storybook/react";
import { LinkList, type LinkListItem } from "./link-list";

const meta: Meta<typeof LinkList> = {
  title: "Navigation/LinkList",
  component: LinkList,
  argTypes: {
    style: {
      control: "radio",
      options: ["default", "small"],
    },
    maxShown: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof LinkList>;

const items: LinkListItem[] = [
  {
    title: "Apply for HDB BTO flat",
    description: "Submit your application during the next sales launch.",
    href: "#bto",
  },
  {
    title: "Renew CPF nomination",
    description: "Last updated 12 months ago.",
    href: "#cpf",
  },
  {
    title: "Update mailing address",
    description: "Required if you have moved house in the last 28 days.",
    href: "#address",
  },
  {
    title: "Schedule passport collection",
    description: "Collection slots open daily at 8am.",
    href: "#passport",
  },
  {
    title: "Pay outstanding fines",
    description: "Avoid late penalties by settling within 14 days.",
    href: "#fines",
  },
];

export const Default: Story = {
  render: (args) => (
    <div className="w-full max-w-xl border border-lifesg-border p-4">
      <LinkList {...args} items={items.slice(0, 3)} />
    </div>
  ),
};

export const Small: Story = {
  render: (args) => (
    <div className="w-full max-w-xl border border-lifesg-border p-4">
      <LinkList {...args} items={items.slice(0, 3)} style="small" />
    </div>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-xl border border-lifesg-border p-4">
      <LinkList
        {...args}
        items={items.map((i) => ({ ...i, description: undefined }))}
      />
    </div>
  ),
};

export const WithSecondaryDescription: Story = {
  render: (args) => (
    <div className="w-full max-w-xl border border-lifesg-border p-4">
      <LinkList
        {...args}
        items={items.slice(0, 3).map((i) => ({
          ...i,
          secondaryDescription: "Updated this week",
        }))}
      />
    </div>
  ),
};

export const ExpandableViewMore: Story = {
  render: (args) => (
    <div className="w-full max-w-xl border border-lifesg-border p-4">
      <LinkList {...args} items={items} maxShown={3} />
    </div>
  ),
};
