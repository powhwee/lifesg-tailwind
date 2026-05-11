"use client";

import { Home, Calendar, FileText, Settings } from "lucide-react";
import { HouseIcon } from "@lifesg/react-icons/house";
import { CalendarIcon } from "@lifesg/react-icons/calendar";
import { DocFillIcon } from "@lifesg/react-icons/doc-fill";
import { GearIcon } from "@lifesg/react-icons/gear";
import { Sidenav } from "@/components/ui/sidenav";
import { Sidenav as LifeSGSidenav } from "@lifesg/react-design-system/sidenav";

export function OursPane() {
  return (
    <div>
      <code className="text-xs text-muted-foreground" data-token="default">default</code>
      <div className="mt-2 relative h-[28rem] border border-border overflow-hidden">
        <Sidenav fixed={false} aria-label="Main">
          <Sidenav.Group>
            <Sidenav.Item id="home" title="Home" icon={<Home />} selected />
            <Sidenav.Item id="calendar" title="Calendar" icon={<Calendar />}>
              <Sidenav.DrawerItem title="This week">
                <Sidenav.DrawerSubitem title="Monday" />
                <Sidenav.DrawerSubitem title="Tuesday" />
                <Sidenav.DrawerSubitem title="Wednesday" />
              </Sidenav.DrawerItem>
              <Sidenav.DrawerItem title="Next week">
                <Sidenav.DrawerSubitem title="Monday" />
                <Sidenav.DrawerSubitem title="Tuesday" />
              </Sidenav.DrawerItem>
              <Sidenav.DrawerItem title="Past appointments" />
            </Sidenav.Item>
            <Sidenav.Item id="documents" title="Documents" icon={<FileText />}>
              <Sidenav.DrawerItem title="Recent" />
              <Sidenav.DrawerItem title="Shared with me" />
              <Sidenav.DrawerItem title="Archive" />
            </Sidenav.Item>
          </Sidenav.Group>
          <Sidenav.Group separator>
            <Sidenav.Item id="settings" title="Settings" icon={<Settings />} />
          </Sidenav.Group>
        </Sidenav>
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div>
      <code className="text-xs text-muted-foreground" data-token="default">default</code>
      <div className="mt-2 relative h-[28rem] border border-border overflow-hidden">
        <LifeSGSidenav fixed={false} aria-label="Main">
          <LifeSGSidenav.Group>
            <LifeSGSidenav.Item title="Home" icon={<HouseIcon />} selected />
            <LifeSGSidenav.Item title="Calendar" icon={<CalendarIcon />}>
              <LifeSGSidenav.DrawerItem title="This week">
                <LifeSGSidenav.DrawerSubitem title="Monday" />
                <LifeSGSidenav.DrawerSubitem title="Tuesday" />
                <LifeSGSidenav.DrawerSubitem title="Wednesday" />
              </LifeSGSidenav.DrawerItem>
              <LifeSGSidenav.DrawerItem title="Next week">
                <LifeSGSidenav.DrawerSubitem title="Monday" />
                <LifeSGSidenav.DrawerSubitem title="Tuesday" />
              </LifeSGSidenav.DrawerItem>
              <LifeSGSidenav.DrawerItem title="Past appointments" />
            </LifeSGSidenav.Item>
            <LifeSGSidenav.Item title="Documents" icon={<DocFillIcon />}>
              <LifeSGSidenav.DrawerItem title="Recent" />
              <LifeSGSidenav.DrawerItem title="Shared with me" />
              <LifeSGSidenav.DrawerItem title="Archive" />
            </LifeSGSidenav.Item>
          </LifeSGSidenav.Group>
          <LifeSGSidenav.Group separator>
            <LifeSGSidenav.Item title="Settings" icon={<GearIcon />} />
          </LifeSGSidenav.Group>
        </LifeSGSidenav>
      </div>
    </div>
  );
}
