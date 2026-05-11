"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Modal as LifeSGModal } from "@lifesg/react-design-system/modal";
import { Button } from "@/components/ui/button";

function OursDemo() {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Button onClick={() => setShow(true)}>Open modal (ours)</Button>
      <Modal show={show} onOverlayClick={() => setShow(false)} aria-labelledby="our-modal-title">
        <Modal.Box showCloseButton onClose={() => setShow(false)} className="w-[28rem]">
          <h2 id="our-modal-title" className="text-xl font-semibold mb-3 pr-10">
            Confirm appointment
          </h2>
          <p className="text-sm mb-6">
            Bookings can be rescheduled up to 24 hours in advance. Continue with this slot?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={() => setShow(false)}>Confirm</Button>
          </div>
        </Modal.Box>
      </Modal>
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
        Open modal (LifeSG)
      </button>
      <LifeSGModal show={show} onOverlayClick={() => setShow(false)}>
        <div style={{
          background: "white", padding: "2rem", borderRadius: "0.5rem",
          width: "28rem", maxWidth: "90vw",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Confirm appointment
          </h2>
          <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Bookings can be rescheduled up to 24 hours in advance. Continue with this slot?
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button onClick={() => setShow(false)} style={{
              background: "transparent", border: "1px solid var(--lifesg-border-primary)",
              color: "var(--lifesg-text-primary)", height: "3rem", padding: "0 1rem",
              borderRadius: "0.375rem", fontWeight: 600, cursor: "pointer",
            }}>Cancel</button>
            <button onClick={() => setShow(false)} style={{
              background: "var(--lifesg-bg-primary)", color: "var(--lifesg-text-inverse)",
              border: "none", height: "3rem", padding: "0 1rem",
              borderRadius: "0.375rem", fontWeight: 600, cursor: "pointer",
            }}>Confirm</button>
          </div>
        </div>
      </LifeSGModal>
    </>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-4" data-token="default">
      <p className="text-xs text-muted-foreground">
        Click to open. <kbd>Esc</kbd>, backdrop click, or close-button all dismiss.
      </p>
      <OursDemo />
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-4" data-token="default">
      <p className="text-xs text-muted-foreground">
        Click to open. Backdrop click dismisses.
      </p>
      <LifeSGDemo />
    </div>
  );
}
