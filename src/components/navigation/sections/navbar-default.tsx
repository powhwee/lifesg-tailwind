"use client";

import { Navbar } from "@/components/ui/navbar";
import { Navbar as LifeSGNavbar } from "@lifesg/react-design-system/navbar";

const sampleItems = [
  { id: "services",      label: "Services",      href: "#" },
  { id: "appointments",  label: "Appointments",  href: "#" },
  { id: "documents",     label: "My documents",  href: "#" },
  { id: "help",          label: "Help",          href: "#" },
];

export function OursPane() {
  return (
    <div>
      <code className="text-xs text-muted-foreground" data-token="default">default (with masthead)</code>
      <div className="mt-2 border border-border overflow-hidden">
        <Navbar
          brand={{ brandName: "Agency", href: "#" }}
          items={sampleItems}
          selectedId="services"
          actions={[
            { id: "login",  label: "Log in",  variant: "outline" },
            { id: "signup", label: "Sign up" },
          ]}
          masthead
        />
        <div className="h-32 bg-[var(--lifesg-bg-strong)]" />
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div>
      <code className="text-xs text-muted-foreground" data-token="default">default (with masthead)</code>
      <div className="mt-2 border border-border overflow-hidden">
        <LifeSGNavbar
          items={{
            desktop: sampleItems.map((i) => ({ id: i.id, children: i.label, href: i.href })),
          }}
          actionButtons={{
            desktop: [
              { type: "button", args: { children: "Log in",  onClick: () => {} } },
              { type: "button", args: { children: "Sign up", onClick: () => {} } },
            ],
          }}
          resources={{
            primary: {
              brandName: "Agency",
              logoSrc:
                "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Crect width='36' height='36' rx='6' fill='%231768BE'/%3E%3C/svg%3E",
            },
          }}
          selectedId="services"
          masthead
        />
        <div className="h-32 bg-[var(--lifesg-bg-strong)]" />
      </div>
    </div>
  );
}
