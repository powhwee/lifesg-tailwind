import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { LocalNav } from "./local-nav";

const meta: Meta<typeof LocalNav.Menu> = {
  title: "Navigation/LocalNav",
  component: LocalNav.Menu,
};

export default meta;
type Story = StoryObj<typeof LocalNav.Menu>;

const items = [
  { title: "Overview", id: "overview" },
  { title: "Eligibility", id: "eligibility" },
  { title: "How to apply", id: "how-to-apply" },
  { title: "Required documents", id: "docs" },
  { title: "FAQs", id: "faqs" },
];

export const Menu: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(0);
    return (
      <div className="w-72 border border-lifesg-border">
        <LocalNav.Menu
          items={items}
          selectedItemIndex={selected}
          onNavItemSelect={(_, __, i) => setSelected(i)}
        />
      </div>
    );
  },
};

export const Dropdown: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(0);
    return (
      <div className="w-full max-w-md p-4 bg-lifesg-bg-subtle">
        <LocalNav.Dropdown
          items={items}
          defaultLabel="On this page"
          selectedItemIndex={selected}
          onNavItemSelect={(_, __, i) => setSelected(i)}
        />
      </div>
    );
  },
};

export const MenuWithCustomRender: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(2);
    return (
      <div className="w-80 border border-lifesg-border">
        <LocalNav.Menu
          items={items}
          selectedItemIndex={selected}
          onNavItemSelect={(_, __, i) => setSelected(i)}
          renderItem={(item, { selected }) => (
            <span className="flex items-center gap-2">
              <span>{item.title}</span>
              {selected && (
                <span className="ml-auto text-xs uppercase tracking-wide text-lifesg-text-subtle">
                  current
                </span>
              )}
            </span>
          )}
        />
      </div>
    );
  },
};
