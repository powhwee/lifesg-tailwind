"use client";

import * as React from "react";
import { LocalNav } from "@/components/ui/local-nav";
import { LocalNavMenu as LifeSGLocalNavMenu, LocalNavDropdown as LifeSGLocalNavDropdown } from "@lifesg/react-design-system/local-nav";

const items = [
  { id: "what",     title: "What you need" },
  { id: "how",      title: "How to apply" },
  { id: "fees",     title: "Fees and timeline" },
  { id: "support",  title: "Get support" },
];

function PaneDemo({ flavour }: { flavour: "ours" | "lifesg" }) {
  const [active, setActive] = React.useState(0);
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground" data-token="menu">menu (horizontal pills)</code>
        <div className="mt-2">
          {flavour === "ours" ? (
            <LocalNav.Menu items={items} selectedItemIndex={active} onNavItemSelect={(_, __, i) => setActive(i)} />
          ) : (
            <LifeSGLocalNavMenu items={items} selectedItemIndex={active} onNavItemSelect={(_, __, i) => setActive(i)} />
          )}
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="dropdown">dropdown (mobile / narrow viewport)</code>
        <div className="mt-2 max-w-sm">
          {flavour === "ours" ? (
            <LocalNav.Dropdown
              items={items}
              selectedItemIndex={active}
              onNavItemSelect={(_, __, i) => setActive(i)}
              defaultLabel="Jump to section"
            />
          ) : (
            <LifeSGLocalNavDropdown
              items={items}
              selectedItemIndex={active}
              onNavItemSelect={(_, __, i) => setActive(i)}
              defaultLabel="Jump to section"
            />
          )}
        </div>
      </section>
    </div>
  );
}

export function OursPane() {
  return <PaneDemo flavour="ours" />;
}

export function LifeSGPane() {
  return <PaneDemo flavour="lifesg" />;
}
