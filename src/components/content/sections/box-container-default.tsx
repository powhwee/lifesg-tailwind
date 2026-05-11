"use client";

import { BoxContainer } from "@/components/ui/box-container";
import { BoxContainer as LifeSGBoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@/components/ui/button";

function Body() {
  return (
    <p className="text-sm">
      Bookings can be rescheduled up to 24 hours in advance. Reach the appointments page
      from the side menu, or directly via the link below.
    </p>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <BoxContainer title="Appointment policy">
            <Body />
          </BoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="collapsible">collapsible</code>
        <div className="mt-2">
          <BoxContainer title="Appointment policy" collapsible>
            <Body />
          </BoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="with-cta">with callToActionComponent</code>
        <div className="mt-2">
          <BoxContainer
            title="Appointment policy"
            collapsible
            clickableHeader={false}
            callToActionComponent={<Button size="sm" variant="ghost">Details</Button>}
          >
            <Body />
          </BoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="error">displayState=&quot;error&quot;</code>
        <div className="mt-2">
          <BoxContainer title="Verification failed" displayState="error">
            <p className="text-sm">We couldn&rsquo;t verify your identity. Try again in 10 minutes.</p>
          </BoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="warning">displayState=&quot;warning&quot;</code>
        <div className="mt-2">
          <BoxContainer title="Expiring soon" displayState="warning">
            <p className="text-sm">Your appointment is in less than 24 hours.</p>
          </BoxContainer>
        </div>
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <LifeSGBoxContainer title="Appointment policy">
            <Body />
          </LifeSGBoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="collapsible">collapsible</code>
        <div className="mt-2">
          <LifeSGBoxContainer title="Appointment policy" collapsible>
            <Body />
          </LifeSGBoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="with-cta">with callToActionComponent</code>
        <div className="mt-2">
          <LifeSGBoxContainer
            title="Appointment policy"
            collapsible
            callToActionComponent={
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--lifesg-text-primary)",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Details
              </button>
            }
          >
            <Body />
          </LifeSGBoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="error">displayState=&quot;error&quot;</code>
        <div className="mt-2">
          <LifeSGBoxContainer title="Verification failed" displayState="error">
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              We couldn&rsquo;t verify your identity. Try again in 10 minutes.
            </p>
          </LifeSGBoxContainer>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="warning">displayState=&quot;warning&quot;</code>
        <div className="mt-2">
          <LifeSGBoxContainer title="Expiring soon" displayState="warning">
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              Your appointment is in less than 24 hours.
            </p>
          </LifeSGBoxContainer>
        </div>
      </div>
    </div>
  );
}
