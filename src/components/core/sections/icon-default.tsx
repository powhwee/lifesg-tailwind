"use client";

import { Icon } from "@/components/ui/icon";
import {
  Check, X, Search, Calendar, Bell, CircleAlert, ChevronRight,
  House, User, Settings, Heart, Bookmark, Mail, Phone, Funnel,
} from "lucide-react";
import {
  TickIcon, CrossIcon, MagnifierIcon, CalendarIcon, BellIcon,
  ExclamationCircleIcon, ChevronRightIcon,
  HouseIcon, PersonIcon, GearIcon, HeartIcon, BookmarkIcon,
  EnvelopeIcon, PhoneIcon, FilterIcon,
} from "@lifesg/react-icons";
import type { ComponentType, SVGProps } from "react";

type Pair = { semantic: string; ours: ComponentType<SVGProps<SVGSVGElement>>; lifesg: ComponentType<SVGProps<SVGSVGElement>> };

const pairs: Pair[] = [
  { semantic: "check",          ours: Check,          lifesg: TickIcon },
  { semantic: "close",          ours: X,              lifesg: CrossIcon },
  { semantic: "search",         ours: Search,         lifesg: MagnifierIcon },
  { semantic: "calendar",       ours: Calendar,       lifesg: CalendarIcon },
  { semantic: "bell",           ours: Bell,           lifesg: BellIcon },
  { semantic: "alert-circle",   ours: CircleAlert,    lifesg: ExclamationCircleIcon },
  { semantic: "chevron-right",  ours: ChevronRight,   lifesg: ChevronRightIcon },
  { semantic: "home",           ours: House,          lifesg: HouseIcon },
  { semantic: "user",           ours: User,           lifesg: PersonIcon },
  { semantic: "settings",       ours: Settings,       lifesg: GearIcon },
  { semantic: "heart",          ours: Heart,          lifesg: HeartIcon },
  { semantic: "bookmark",       ours: Bookmark,       lifesg: BookmarkIcon },
  { semantic: "mail",           ours: Mail,           lifesg: EnvelopeIcon },
  { semantic: "phone",          ours: Phone,          lifesg: PhoneIcon },
  { semantic: "filter",         ours: Funnel,         lifesg: FilterIcon },
];

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded border border-border">
      <div className="size-8 flex items-center justify-center" data-token={label}>{children}</div>
      <code className="text-[10px] text-muted-foreground">{label}</code>
    </div>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-2">Lucide via &lt;Icon as={"{IconComponent}"} /&gt;</h3>
        <p className="text-xs text-muted-foreground mb-3">
          ~1300 icons. Default 24×24. Single colour via <code>currentColor</code>. Tones routed through L3
          tokens (<code>--icon-color-*</code>).
        </p>
        <div className="grid grid-cols-5 gap-2">
          {pairs.map((p) => (
            <Cell key={p.semantic} label={p.semantic}>
              <Icon as={p.ours} size="lg" />
            </Cell>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Tone variants</h3>
        <div className="grid grid-cols-5 gap-2">
          {(["default","subtle","strong","primary","success","warning","error","info"] as const).map((t) => (
            <Cell key={t} label={t}>
              <Icon as={Bell} size="lg" tone={t} />
            </Cell>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Sizes</h3>
        <div className="flex items-end gap-4">
          {(["xs","sm","md","lg","xl"] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Icon as={Check} size={s} />
              <code className="text-[10px] text-muted-foreground">{s}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-2">@lifesg/react-icons</h3>
        <p className="text-xs text-muted-foreground mb-3">
          ~233 icons. Plain <code>SVGProps&lt;SVGSVGElement&gt;</code>. No tone / size system — size via
          width/height / CSS; colour via <code>color</code> / CSS.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {pairs.map((p) => {
            const C = p.lifesg;
            return (
              <Cell key={p.semantic} label={p.semantic}>
                <C width={24} height={24} color="var(--lifesg-icon)" />
              </Cell>
            );
          })}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Tone (via CSS color)</h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            ["default", "var(--lifesg-icon)"],
            ["subtle",  "var(--lifesg-icon-subtle)"],
            ["strong",  "var(--lifesg-icon-strongest)"],
            ["primary", "var(--lifesg-icon-primary)"],
            ["success", "var(--lifesg-icon-success)"],
            ["warning", "var(--lifesg-icon-warning)"],
            ["error",   "var(--lifesg-icon-error)"],
            ["info",    "var(--lifesg-icon-info)"],
          ].map(([t, c]) => (
            <Cell key={t} label={t}>
              <BellIcon width={24} height={24} color={c} />
            </Cell>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Sizes (px)</h3>
        <div className="flex items-end gap-4">
          {[12, 16, 20, 24, 32].map((px) => (
            <div key={px} className="flex flex-col items-center gap-1">
              <TickIcon width={px} height={px} />
              <code className="text-[10px] text-muted-foreground">{px}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
