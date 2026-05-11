"use client";

import { UneditableSection } from "@/components/ui/uneditable-section";
import { UneditableSection as LifeSGUneditableSection } from "@lifesg/react-design-system/uneditable-section";

const items = [
  { label: "Full name", value: "Tan Wei Ling", displayWidth: "half" as const },
  { label: "NRIC", value: "S••••567A", displayWidth: "half" as const },
  { label: "Date of birth", value: "14 March 1992", displayWidth: "half" as const },
  { label: "Nationality", value: "Singaporean", displayWidth: "half" as const },
  { label: "Residential address", value: "Blk 123, Tampines St 11, #08-456, Singapore 521123" },
  { label: "Contact number", value: "+65 9123 4567", displayWidth: "half" as const },
  { label: "Email", value: "wlt@example.com", displayWidth: "half" as const },
];

export function OursPane() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <UneditableSection
          className="mt-2"
          title="Personal details"
          description="Last verified 8 March 2026 via Singpass."
          items={items}
        />
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="background-false">background=&#123;false&#125;</code>
        <UneditableSection
          className="mt-2"
          background={false}
          title="Personal details"
          items={items.slice(0, 4)}
        />
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <LifeSGUneditableSection
            title="Personal details"
            description="Last verified 8 March 2026 via Singpass."
            items={items}
          />
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="background-false">background=&#123;false&#125;</code>
        <div className="mt-2">
          <LifeSGUneditableSection
            background={false}
            title="Personal details"
            items={items.slice(0, 4)}
          />
        </div>
      </div>
    </div>
  );
}
