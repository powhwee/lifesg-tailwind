import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerClose,
} from "./drawer";
import { Button } from "./button";

const meta: Meta<typeof DrawerContent> = {
  title: "Overlays/Drawer",
  component: DrawerContent,
  parameters: { layout: "fullscreen" },
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    hideClose: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DrawerContent>;

function OpenDrawer({
  side,
  hideClose,
  children,
}: {
  side?: "left" | "right" | "top" | "bottom";
  hideClose?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Drawer defaultOpen>
      <DrawerContent side={side} hideClose={hideClose}>
        {children ?? (
          <>
            <DrawerHeader>
              <DrawerTitle>Filter results</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="p-4">
              <p className="text-sm">
                Drawer body content. Scrolls vertically if it overflows the
                available height. Drop in form fields, lists, or any other
                composition here.
              </p>
            </DrawerBody>
            <DrawerFooter>
              <Button className="w-full">Apply</Button>
              <DrawerClose render={<Button variant="outline" className="w-full">Cancel</Button>} />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  render: () => <OpenDrawer />,
};

export const Left: Story = {
  render: () => <OpenDrawer side="left" />,
};

export const Top: Story = {
  render: () => <OpenDrawer side="top" />,
};

export const Bottom: Story = {
  render: () => <OpenDrawer side="bottom" />,
};

export const HideClose: Story = {
  render: () => <OpenDrawer hideClose />,
};

export const BodyOnly: Story = {
  render: () => (
    <OpenDrawer>
      <DrawerBody className="p-6">
        <p className="text-sm">Body content without a Header or Footer.</p>
      </DrawerBody>
    </OpenDrawer>
  ),
};

export const TriggeredByButton: Story = {
  render: () => (
    <div className="p-6">
      <Drawer>
        <DrawerTrigger render={<Button>Open drawer</Button>} />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Triggered drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="p-4">
            <p className="text-sm">
              The drawer opens on click and closes via the X button, overlay
              click, or Escape.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};
