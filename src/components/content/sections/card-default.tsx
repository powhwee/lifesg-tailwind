"use client";

import { Card } from "@/components/ui/card";
import { Card as LifeSGCard } from "@lifesg/react-design-system/card";

const SampleCopy = () => (
  <>
    Bring your IC and a recent utility bill. Bookings can be rescheduled up to 24 hours
    in advance from the appointments page.
  </>
);

export function OursPane() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <Card className="mt-2 max-w-md">
          <Card.Header>
            <Card.Title>Appointment confirmed</Card.Title>
            <Card.Description>2:30 pm — Tampines branch</Card.Description>
          </Card.Header>
          <Card.Body><SampleCopy /></Card.Body>
        </Card>
      </div>

      <div>
        <code className="text-xs text-muted-foreground" data-token="passthrough">
          passthrough children
        </code>
        <Card className="mt-2 max-w-md text-sm">
          <p>
            Cards accept any children directly. Sub-components are an optional convenience.
          </p>
        </Card>
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <LifeSGCard style={{ marginTop: 8, maxWidth: "28rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>Appointment confirmed</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--lifesg-text-subtle)", margin: 0 }}>
              2:30 pm — Tampines branch
            </p>
          </div>
          <div style={{ fontSize: "0.875rem" }}><SampleCopy /></div>
        </LifeSGCard>
      </div>

      <div>
        <code className="text-xs text-muted-foreground" data-token="passthrough">
          passthrough children
        </code>
        <LifeSGCard style={{ marginTop: 8, maxWidth: "28rem", fontSize: "0.875rem" }}>
          <p>
            Cards accept any children directly. LifeSG ships only the outer styled div.
          </p>
        </LifeSGCard>
      </div>
    </div>
  );
}
