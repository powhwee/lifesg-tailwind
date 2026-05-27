import type { Meta, StoryObj } from "@storybook/react";
import { Home, FileText, Settings, BookOpen, Wallet, Users } from "lucide-react";
import { Sidenav } from "./sidenav";

const meta: Meta<typeof Sidenav> = {
  title: "Navigation/Sidenav",
  component: Sidenav,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Sidenav>;

export const Default: Story = {
  render: () => (
    <div className="h-[640px] flex">
      <Sidenav fixed={false} aria-label="Primary">
        <Sidenav.Group>
          <Sidenav.Item title="Home" icon={<Home />} selected />
          <Sidenav.Item title="Docs" icon={<FileText />} />
          <Sidenav.Item title="Settings" icon={<Settings />} />
        </Sidenav.Group>
      </Sidenav>
      <div className="flex-1 p-6 bg-lifesg-bg-subtle">
        <p className="text-sm">Page content</p>
      </div>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div className="h-[640px] flex">
      <Sidenav fixed={false}>
        <Sidenav.Group separator>
          <Sidenav.Item title="Home" icon={<Home />} selected />
          <Sidenav.Item title="Docs" icon={<FileText />} />
        </Sidenav.Group>
        <Sidenav.Group>
          <Sidenav.Item title="Wallet" icon={<Wallet />} />
          <Sidenav.Item title="Settings" icon={<Settings />} />
        </Sidenav.Group>
      </Sidenav>
      <div className="flex-1 p-6 bg-lifesg-bg-subtle">
        <p className="text-sm">Page content</p>
      </div>
    </div>
  ),
};

export const WithExpandingDrawer: Story = {
  render: () => (
    <div className="h-[640px] flex">
      <Sidenav fixed={false}>
        <Sidenav.Group>
          <Sidenav.Item title="Home" icon={<Home />} selected />
          <Sidenav.Item id="docs" title="Docs" icon={<BookOpen />}>
            <Sidenav.DrawerItem title="Getting started" />
            <Sidenav.DrawerItem title="Forms">
              <Sidenav.DrawerSubitem title="Input" />
              <Sidenav.DrawerSubitem title="Select" />
              <Sidenav.DrawerSubitem title="Date input" />
            </Sidenav.DrawerItem>
            <Sidenav.DrawerItem title="Layout" />
          </Sidenav.Item>
          <Sidenav.Item id="users" title="Users" icon={<Users />}>
            <Sidenav.DrawerItem title="All users" />
            <Sidenav.DrawerItem title="Invitations" />
            <Sidenav.DrawerItem title="Roles" />
          </Sidenav.Item>
          <Sidenav.Item title="Settings" icon={<Settings />} />
        </Sidenav.Group>
      </Sidenav>
      <div className="flex-1 p-6 bg-lifesg-bg-subtle">
        <p className="text-sm">
          Click the Docs or Users icon to expand the drawer panel.
        </p>
      </div>
    </div>
  ),
};
