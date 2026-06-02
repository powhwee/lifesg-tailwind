import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Navbar, type NavbarProps } from "./navbar";

const meta: Meta<typeof Navbar> = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const brand: NavbarProps["brand"] = {
  brandName: "LifeSG",
};

const items: NavbarProps["items"] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "services", label: "Services", href: "#services" },
  { id: "help", label: "Help", href: "#help" },
  { id: "about", label: "About", href: "#about" },
];

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Navbar brand={brand} items={items} />,
};

export const WithSelected: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Navbar brand={brand} items={items} selectedId="services" />,
};

export const WithActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Navbar
      brand={brand}
      items={items}
      selectedId="home"
      actions={[
        { id: "login", label: "Log in", variant: "outline" },
        { id: "signup", label: "Sign up" },
      ]}
    />
  ),
};

export const WithMasthead: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Navbar brand={brand} items={items} selectedId="home" masthead />
  ),
};

export const FullChrome: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Navbar
      brand={brand}
      items={items}
      selectedId="services"
      masthead
      actions={[
        { id: "login", label: "Log in", variant: "outline" },
        { id: "signup", label: "Sign up" },
      ]}
    />
  ),
};
