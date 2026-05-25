import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { Typography } from "./typography";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <div className="p-12">
      <Popover>
        <PopoverTrigger
          render={(triggerProps) => (
            <Button {...triggerProps}>Open Popover</Button>
          )}
        />
        <PopoverContent className="p-4 w-72">
          <Typography variant="heading-xs" weight="bold" className="mb-2">
            Help Guidelines
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground">
            Popovers anchor to their trigger elements. You can dismiss this overlay by clicking outside or pressing Escape.
          </Typography>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const CustomPlacement: Story = {
  render: () => (
    <div className="p-24 flex items-center justify-center gap-4">
      <Popover>
        <PopoverTrigger
          render={(triggerProps) => (
            <Button variant="outline" {...triggerProps}>Above + Start</Button>
          )}
        />
        <PopoverContent side="top" align="start" className="p-3 w-64">
          <Typography variant="body-sm">
            This popup is anchored to the top side, aligned to the start of the button trigger.
          </Typography>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
