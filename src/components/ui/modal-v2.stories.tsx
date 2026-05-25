import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ModalV2 } from "./modal-v2";
import { Button } from "./button";
import { Typography } from "./typography";

const meta: Meta<typeof ModalV2> = {
  title: "Overlays/ModalV2",
  component: ModalV2,
  argTypes: {
    show: {
      control: "boolean",
    },
    enableOverlayClick: {
      control: "boolean",
    },
    animationFrom: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalV2>;

export const Default: Story = {
  render: (args) => {
    const [show, setShow] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setShow(true)}>Open ModalV2</Button>
        <ModalV2
          {...args}
          show={show}
          onClose={() => setShow(false)}
          onOverlayClick={() => {
            if (args.enableOverlayClick !== false) {
              setShow(false);
            }
          }}
        >
          <ModalV2.Card>
            <ModalV2.CloseButton />
            <ModalV2.Content>
              <Typography variant="heading-md" weight="bold" className="mb-4">
                Proceed with Submission?
              </Typography>
              <Typography variant="body-md" className="text-muted-foreground">
                By confirming, you agree that all information entered is accurate to the best of your knowledge. An SMS confirmation will be sent.
              </Typography>
            </ModalV2.Content>
            <ModalV2.Footer
              primaryButton={<Button onClick={() => setShow(false)}>Proceed</Button>}
              secondaryButton={<Button variant="outline" onClick={() => setShow(false)}>Cancel</Button>}
            />
          </ModalV2.Card>
        </ModalV2>
      </div>
    );
  },
  args: {
    animationFrom: "bottom",
    enableOverlayClick: true,
  },
};
