import type { Meta, StoryObj } from "@storybook/react";
import { User } from "lucide-react";
import { Avatar } from "./avatar";
import { Row } from "@/components/storybook-common";

const meta: Meta<typeof Avatar> = {
  title: "Navigation/Avatar",
  component: Avatar,
  argTypes: {
    sizeType: {
      control: "radio",
      options: ["default", "small"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    children: "Jane Doe",
    sizeType: "default",
  },
};

export const Small: Story = {
  args: {
    children: "Mei Ling",
    sizeType: "small",
  },
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&q=80&fit=crop"
        alt="Profile photo"
        className="size-full object-cover"
      />
    </Avatar>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Avatar>
      <User className="size-1/2" aria-hidden />
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row gap={4}>
      <Avatar sizeType="small">A</Avatar>
      <Avatar sizeType="default">B</Avatar>
    </Row>
  ),
};

export const InitialsGallery: Story = {
  render: () => (
    <Row gap={3}>
      <Avatar>Alice</Avatar>
      <Avatar>Bob</Avatar>
      <Avatar>Charlie</Avatar>
      <Avatar>Diana</Avatar>
      <Avatar>Edward</Avatar>
    </Row>
  ),
};
