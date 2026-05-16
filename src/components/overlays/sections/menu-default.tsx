"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";

export function OursPane() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [align, setAlign] = useState("left");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">basic — action menu</code>
        <div className="mt-3">
          <Menu>
            <MenuTrigger
              render={(triggerProps) => (
                <Button {...triggerProps} variant="secondary" size="sm">
                  Actions
                  <ChevronDown className="size-4" />
                </Button>
              )}
            />
            <MenuContent>
              <MenuItem onClick={() => alert("Edit")}>Edit</MenuItem>
              <MenuItem onClick={() => alert("Duplicate")}>Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem onClick={() => alert("Delete")} className="text-lifesg-text-error">
                Delete
              </MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">overflow trigger + groups + checkbox + radio</code>
        <div className="mt-3">
          <Menu>
            <MenuTrigger
              render={(triggerProps) => (
                <button
                  {...triggerProps}
                  type="button"
                  aria-label="More actions"
                  className="grid place-items-center size-8 rounded-md hover:bg-lifesg-bg-hover"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              )}
            />
            <MenuContent className="min-w-[12rem]">
              <MenuGroup>
                <MenuGroupLabel>Format</MenuGroupLabel>
                <MenuCheckboxItem checked={bold} onCheckedChange={setBold}>
                  Bold
                </MenuCheckboxItem>
                <MenuCheckboxItem checked={italic} onCheckedChange={setItalic}>
                  Italic
                </MenuCheckboxItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuGroup>
                <MenuGroupLabel>Align</MenuGroupLabel>
                <MenuRadioGroup value={align} onValueChange={(v) => setAlign(v as string)}>
                  <MenuRadioItem value="left">Left</MenuRadioItem>
                  <MenuRadioItem value="center">Center</MenuRadioItem>
                  <MenuRadioItem value="right">Right</MenuRadioItem>
                </MenuRadioGroup>
              </MenuGroup>
            </MenuContent>
          </Menu>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">LifeSG ships no public Menu component</code>
        <div className="mt-3 rounded-md border border-lifesg-border p-4 bg-lifesg-bg-strong text-sm space-y-2">
          <p>
            LifeSG&rsquo;s Storybook lists Menu under Overlays but the underlying export is an
            internal used by the Sidenav and a few other components. There&rsquo;s no public{" "}
            <code>Menu</code> in <code>@lifesg/react-design-system</code> for end-user consumption,
            so there&rsquo;s nothing to render here as the LifeSG reference.
          </p>
          <p>
            We ported a <code>Menu</code> primitive from <code>@base-ui/react/menu</code> for
            future use cases (action menus, context menus, formatting toolbars, &ldquo;more&rdquo;
            overflow buttons on cards).
          </p>
        </div>
      </section>
    </div>
  );
}
