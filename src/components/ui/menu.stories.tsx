import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioGroup,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from "./menu";
import { Button } from "./button";

const meta: Meta<typeof MenuContent> = {
  title: "Overlays/Menu",
  component: MenuContent,
};

export default meta;
type Story = StoryObj<typeof MenuContent>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-6">
      <Menu defaultOpen>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuItem>New file</MenuItem>
          <MenuItem>Open…</MenuItem>
          <MenuItem>Save</MenuItem>
          <MenuSeparator />
          <MenuItem>Settings</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const WithGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-6">
      <Menu defaultOpen>
        <MenuTrigger render={<Button>File</Button>} />
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Recent</MenuGroupLabel>
            <MenuItem>plan.md</MenuItem>
            <MenuItem>budget.xlsx</MenuItem>
            <MenuItem>roadmap.pdf</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Actions</MenuGroupLabel>
            <MenuItem>Export…</MenuItem>
            <MenuItem>Print</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const CheckboxItems: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [bold, setBold] = React.useState(true);
    const [italic, setItalic] = React.useState(false);
    const [underline, setUnderline] = React.useState(false);
    return (
      <div className="p-6">
        <Menu defaultOpen>
          <MenuTrigger render={<Button>Format</Button>} />
          <MenuContent>
            <MenuCheckboxItem
              checked={bold}
              onCheckedChange={(c) => setBold(c)}
            >
              Bold
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={italic}
              onCheckedChange={(c) => setItalic(c)}
            >
              Italic
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={underline}
              onCheckedChange={(c) => setUnderline(c)}
            >
              Underline
            </MenuCheckboxItem>
          </MenuContent>
        </Menu>
      </div>
    );
  },
};

export const RadioGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = React.useState("light");
    return (
      <div className="p-6">
        <Menu defaultOpen>
          <MenuTrigger render={<Button>Theme</Button>} />
          <MenuContent>
            <MenuRadioGroup value={value} onValueChange={setValue}>
              <MenuRadioItem value="light">Light</MenuRadioItem>
              <MenuRadioItem value="dark">Dark</MenuRadioItem>
              <MenuRadioItem value="system">System</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
      </div>
    );
  },
};

export const Submenu: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-6">
      <Menu defaultOpen>
        <MenuTrigger render={<Button>Edit</Button>} />
        <MenuContent>
          <MenuItem>Undo</MenuItem>
          <MenuItem>Redo</MenuItem>
          <MenuSeparator />
          <MenuSubmenu>
            <MenuSubmenuTrigger className="flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer data-[highlighted]:bg-lifesg-bg-hover outline-none">
              Export to…
            </MenuSubmenuTrigger>
            <MenuContent>
              <MenuItem>PDF</MenuItem>
              <MenuItem>CSV</MenuItem>
              <MenuItem>Markdown</MenuItem>
            </MenuContent>
          </MenuSubmenu>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const LinkItems: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-6">
      <Menu defaultOpen>
        <MenuTrigger render={<Button>Quick links</Button>} />
        <MenuContent>
          <MenuLinkItem href="#dashboard">Dashboard</MenuLinkItem>
          <MenuLinkItem href="#profile">Profile</MenuLinkItem>
          <MenuLinkItem href="https://www.life.gov.sg" target="_blank">
            LifeSG ↗
          </MenuLinkItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const DisabledItems: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-6">
      <Menu defaultOpen>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuItem>New file</MenuItem>
          <MenuItem disabled>Reopen recent (no recents)</MenuItem>
          <MenuSeparator />
          <MenuItem disabled>Delete (no selection)</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};
