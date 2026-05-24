"use client";

import * as React from "react";
import { ModalV2 } from "@/components/ui/modal-v2";
import { ModalV2 as LifeSGModalV2 } from "@lifesg/react-design-system/modal-v2";
import { Button } from "@/components/ui/button";

function OursDemo() {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Button onClick={() => setShow(true)}>Open ModalV2 (ours)</Button>
      <ModalV2
        show={show}
        onClose={() => setShow(false)}
        onOverlayClick={() => setShow(false)}
        aria-labelledby="our-modal-v2-title"
      >
        <ModalV2.Card>
          <ModalV2.CloseButton />
          <ModalV2.Content>
            <h2
              id="our-modal-v2-title"
              className="text-component-header leading-component-header font-bold mb-3"
            >
              Confirm appointment
            </h2>
            <p className="text-component-body leading-component-body">
              Bookings can be rescheduled up to 24 hours in advance. Continue
              with this slot?
            </p>
          </ModalV2.Content>
          <ModalV2.Footer
            primaryButton={
              <Button onClick={() => setShow(false)}>Confirm</Button>
            }
            secondaryButton={
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>
            }
          />
        </ModalV2.Card>
      </ModalV2>
    </>
  );
}

function LifeSGDemo() {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <button
        onClick={() => setShow(true)}
        style={{
          background: "var(--lifesg-bg-primary)",
          color: "var(--lifesg-text-inverse)",
          border: "none",
          height: "3rem",
          padding: "0 1rem",
          borderRadius: "0.375rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Open ModalV2 (LifeSG)
      </button>
      <LifeSGModalV2
        show={show}
        onClose={() => setShow(false)}
        onOverlayClick={() => setShow(false)}
      >
        <LifeSGModalV2.Card>
          <LifeSGModalV2.CloseButton />
          <LifeSGModalV2.Content>
            <h2 style={{ fontSize: "1.375rem", lineHeight: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Confirm appointment
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: "1.5rem" }}>
              Bookings can be rescheduled up to 24 hours in advance. Continue
              with this slot?
            </p>
          </LifeSGModalV2.Content>
          <LifeSGModalV2.Footer
            primaryButton={
              <button
                onClick={() => setShow(false)}
                style={{
                  background: "var(--lifesg-bg-primary)",
                  color: "var(--lifesg-text-inverse)",
                  border: "none",
                  height: "3rem",
                  padding: "0 1rem",
                  borderRadius: "0.375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
            }
            secondaryButton={
              <button
                onClick={() => setShow(false)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--lifesg-border-primary)",
                  color: "var(--lifesg-text-primary)",
                  height: "3rem",
                  padding: "0 1rem",
                  borderRadius: "0.375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            }
          />
        </LifeSGModalV2.Card>
      </LifeSGModalV2>
    </>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-4" data-token="modal-v2-trigger">
      <p className="text-xs text-muted-foreground">
        Slot composition: <code>ModalV2.Card</code> wraps{" "}
        <code>CloseButton</code>, <code>Content</code>, <code>Footer</code>.
        Primary button sits on the right on desktop, stacked on mobile.
      </p>
      <OursDemo />
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-4" data-token="modal-v2-trigger">
      <p className="text-xs text-muted-foreground">
        Same shape rendered from <code>@lifesg/react-design-system/modal-v2</code>.
      </p>
      <LifeSGDemo />
    </div>
  );
}
