"use client";

import { Footer } from "@/components/ui/footer";
import { Footer as LifeSGFooter } from "@lifesg/react-design-system/footer";

const sampleLinks = [
  [
    { href: "#", children: "Apply for HDB BTO" },
    { href: "#", children: "Update particulars" },
    { href: "#", children: "Replace NRIC" },
  ],
  [
    { href: "#", children: "Driving licence" },
    { href: "#", children: "CPF contributions" },
    { href: "#", children: "Medical leave" },
  ],
  [
    { href: "#", children: "Contact us" },
    { href: "#", children: "Feedback" },
    { href: "#", children: "FAQs" },
  ],
];

const lastUpdated = new Date(2026, 4, 12);

export function OursPane() {
  return (
    <div>
      <code className="text-xs text-muted-foreground">default</code>
      <div className="mt-2 border border-border overflow-hidden" data-token="default">
        <Footer links={sampleLinks} copyrightInfo="Agency name" lastUpdated={lastUpdated} />
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div>
      <code className="text-xs text-muted-foreground">default</code>
      <div className="mt-2 border border-border overflow-hidden" data-token="default">
        <LifeSGFooter links={sampleLinks} copyrightInfo="Agency name" lastUpdated={lastUpdated} />
      </div>
    </div>
  );
}
