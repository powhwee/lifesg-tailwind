import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function OpenModal({
  children,
  animationFrom,
  enableOverlayClick = true,
}: {
  children?: React.ReactNode;
  animationFrom?: "top" | "bottom" | "left" | "right";
  enableOverlayClick?: boolean;
}) {
  const [show, setShow] = React.useState(true);
  return (
    <div className="p-6 min-h-[60vh] flex flex-col items-start gap-4">
      <Button onClick={() => setShow(true)}>Re-open modal</Button>
      <Modal
        show={show}
        animationFrom={animationFrom}
        enableOverlayClick={enableOverlayClick}
        onOverlayClick={() => setShow(false)}
        aria-label="Sample modal"
      >
        {children ?? (
          <Modal.Box showCloseButton onClose={() => setShow(false)} className="w-[28rem]">
            <h2 className="text-component-header leading-component-header font-bold mb-2">
              Confirm action
            </h2>
            <p className="text-component-body leading-component-body mb-6">
              Modal v1 — wraps Base UI's `Dialog` with a coloured backdrop and
              entry animation. Click the X, the backdrop, or press Esc to
              dismiss.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShow(false)}>Confirm</Button>
            </div>
          </Modal.Box>
        )}
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: () => <OpenModal />,
};

export const AnimateFromTop: Story = {
  render: () => <OpenModal animationFrom="top" />,
};

export const AnimateFromLeft: Story = {
  render: () => <OpenModal animationFrom="left" />,
};

export const AnimateFromRight: Story = {
  render: () => <OpenModal animationFrom="right" />,
};

export const NoOverlayClick: Story = {
  render: () => (
    <OpenModal enableOverlayClick={false}>
      <Modal.Box showCloseButton onClose={() => {}} className="w-[28rem]">
        <h2 className="text-component-header leading-component-header font-bold mb-2">
          Force decision
        </h2>
        <p className="text-component-body leading-component-body mb-6">
          Clicking the backdrop does nothing — the user must use the X button
          or one of the action buttons below.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </div>
      </Modal.Box>
    </OpenModal>
  ),
};

export const PlainBox: Story = {
  render: () => (
    <OpenModal>
      <Modal.Box className="w-[24rem]">
        <p className="text-component-body leading-component-body">
          Box without an X button — typical for short confirmation prompts
          that have their own footer actions.
        </p>
      </Modal.Box>
    </OpenModal>
  ),
};
