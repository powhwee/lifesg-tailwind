"use client";

import { OrderedList as OurOL, UnorderedList as OurUL } from "@/components/ui/text-list";
import { TextList } from "@lifesg/react-design-system/text-list";
const LifeSGUL = TextList.Ul;
const LifeSGOL = TextList.Ol;
import { Check } from "lucide-react";
import { TickIcon } from "@lifesg/react-icons";
import type { ReactNode } from "react";

function Sec({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  return (
    <section className="border-b border-border last:border-0 pb-4">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div data-token={label}>{children}</div>
    </section>
  );
}

const itemsArr = ["Singpass account", "Identity document", "Recent utility bill"];

export function OursPane() {
  return (
    <div className="flex flex-col gap-6">
      <Sec title="UnorderedList — disc (default)" label="ul-disc">
        <OurUL>
          {itemsArr.map((s) => <span key={s}>{s}</span>)}
        </OurUL>
      </Sec>
      <Sec title='UnorderedList — bulletType="square"' label="ul-square">
        <OurUL bulletType="square">
          {itemsArr.map((s) => <span key={s}>{s}</span>)}
        </OurUL>
      </Sec>
      <Sec title='UnorderedList — bulletType={<Check />} (custom node)' label="ul-custom">
        <OurUL bulletType={<Check className="size-4 text-[var(--lifesg-icon-success)]" />}>
          {itemsArr.map((s) => <span key={s}>{s}</span>)}
        </OurUL>
      </Sec>
      <Sec title="OrderedList — decimal (default)" label="ol-decimal">
        <OurOL>
          {itemsArr.map((s) => <span key={s}>{s}</span>)}
        </OurOL>
      </Sec>
      <Sec title='OrderedList — counterType="lower-alpha"' label="ol-alpha">
        <OurOL counterType="lower-alpha">
          {itemsArr.map((s) => <span key={s}>{s}</span>)}
        </OurOL>
      </Sec>
      <Sec title='OrderedList — counterType="lower-roman", counterSeparator="."' label="ol-roman-dot">
        <OurOL counterType="lower-roman" counterSeparator=".">
          {itemsArr.map((s) => <span key={s}>{s}</span>)}
        </OurOL>
      </Sec>
      <Sec title="size variants (md, sm, xs)" label="sizes">
        <div className="flex flex-col gap-3">
          {(["md", "sm", "xs"] as const).map((sz) => (
            <OurUL key={sz} size={sz}>
              {itemsArr.map((s) => <span key={s}>{s} ({sz})</span>)}
            </OurUL>
          ))}
        </div>
      </Sec>
    </div>
  );
}

const lifesgItems = itemsArr.map((s, i) => <li key={i}>{s}</li>);

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-6">
      <Sec title="UnorderedList — disc (default)" label="ul-disc">
        <LifeSGUL>{lifesgItems}</LifeSGUL>
      </Sec>
      <Sec title='bulletType="square"' label="ul-square">
        <LifeSGUL bulletType="square">{lifesgItems}</LifeSGUL>
      </Sec>
      <Sec title='bulletType={<TickIcon />} (custom node)' label="ul-custom">
        <LifeSGUL bulletType={<TickIcon style={{ width: 16, height: 16, color: "var(--lifesg-icon-success)" }} />}>
          {lifesgItems}
        </LifeSGUL>
      </Sec>
      <Sec title="OrderedList — decimal (default)" label="ol-decimal">
        <LifeSGOL>{lifesgItems}</LifeSGOL>
      </Sec>
      <Sec title='counterType="lower-alpha"' label="ol-alpha">
        <LifeSGOL counterType="lower-alpha">{lifesgItems}</LifeSGOL>
      </Sec>
      <Sec title='counterType="lower-roman", counterSeparator="."' label="ol-roman-dot">
        <LifeSGOL counterType="lower-roman" counterSeparator=".">{lifesgItems}</LifeSGOL>
      </Sec>
      <Sec title="size variants (body-md, body-sm, body-xs)" label="sizes">
        <div className="flex flex-col gap-3">
          {(["body-md", "body-sm", "body-xs"] as const).map((sz) => (
            <LifeSGUL key={sz} size={sz}>
              <li>Singpass account ({sz})</li>
              <li>Identity document ({sz})</li>
              <li>Recent utility bill ({sz})</li>
            </LifeSGUL>
          ))}
        </div>
      </Sec>
    </div>
  );
}
