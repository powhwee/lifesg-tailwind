"use client";

import { LinkList } from "@/components/ui/link-list";
import { LinkList as LifeSGLinkList } from "@lifesg/react-design-system/link-list";

const items = [
  { title: "Apply for HDB BTO flat",       href: "#", description: "Step-by-step application guide for first-time buyers." },
  { title: "Update marital status",        href: "#", description: "Reflect changes from marriage, divorce, or bereavement." },
  { title: "Replace a damaged NRIC",       href: "#", description: "Online replacement; collection at any ICA branch." },
  { title: "Renew driving licence",        href: "#", description: "Renew online; required for class 3 / 3A drivers aged 65 and above." },
  { title: "Submit medical leave records", href: "#", description: "For self-employed CPF contributors." },
];

export function OursPane() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <section>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <LinkList items={items.slice(0, 3)} />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="small">small</code>
        <div className="mt-2">
          <LinkList items={items.slice(0, 3)} style="small" />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="max-shown">maxShown = 2 (view more / view less)</code>
        <div className="mt-2">
          <LinkList items={items} maxShown={2} />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <section>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <LifeSGLinkList items={items.slice(0, 3)} />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="small">small</code>
        <div className="mt-2">
          <LifeSGLinkList items={items.slice(0, 3)} style="small" />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="max-shown">maxShown = 2 (view more / view less)</code>
        <div className="mt-2">
          <LifeSGLinkList items={items} maxShown={2} />
        </div>
      </section>
    </div>
  );
}
