"use client";

import { Accordion } from "@/components/ui/accordion";
import { Accordion as LifeSGAccordion } from "@lifesg/react-design-system/accordion";

const itemA = (
  <p>
    Yes. Bookings can be rescheduled up to 24 hours in advance from the appointments page.
    There is no rescheduling fee.
  </p>
);
const itemB = (
  <p>
    Refunds are processed within 5 working days to the original payment method. If you paid
    via PayNow, the refund returns to the same NRIC-linked account.
  </p>
);
const itemC = (
  <p>
    Call our 24-hour hotline at <strong>1800-225-5226</strong> or visit any LifeSG service
    centre during opening hours.
  </p>
);

export function OursPane() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <Accordion>
            <Accordion.Item title="Can I reschedule my appointment?">{itemA}</Accordion.Item>
            <Accordion.Item title="How are refunds processed?">{itemB}</Accordion.Item>
            <Accordion.Item title="How do I contact support?">{itemC}</Accordion.Item>
          </Accordion>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="expand-all">title + enableExpandAll, initialDisplay=&quot;expand-all&quot;</code>
        <div className="mt-2">
          <Accordion title="Frequently asked questions" enableExpandAll initialDisplay="expand-all">
            <Accordion.Item title="Can I reschedule my appointment?">{itemA}</Accordion.Item>
            <Accordion.Item title="How are refunds processed?">{itemB}</Accordion.Item>
            <Accordion.Item title="How do I contact support?">{itemC}</Accordion.Item>
          </Accordion>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="small">type=&quot;small&quot;</code>
        <div className="mt-2">
          <Accordion>
            <Accordion.Item title="Can I reschedule?" type="small">{itemA}</Accordion.Item>
            <Accordion.Item title="How are refunds processed?" type="small">{itemB}</Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <div>
        <code className="text-xs text-muted-foreground" data-token="default">default</code>
        <div className="mt-2">
          <LifeSGAccordion>
            <LifeSGAccordion.Item title="Can I reschedule my appointment?">{itemA}</LifeSGAccordion.Item>
            <LifeSGAccordion.Item title="How are refunds processed?">{itemB}</LifeSGAccordion.Item>
            <LifeSGAccordion.Item title="How do I contact support?">{itemC}</LifeSGAccordion.Item>
          </LifeSGAccordion>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="expand-all">title + enableExpandAll, initialDisplay=&quot;expand-all&quot;</code>
        <div className="mt-2">
          <LifeSGAccordion title="Frequently asked questions" enableExpandAll initialDisplay="expand-all">
            <LifeSGAccordion.Item title="Can I reschedule my appointment?">{itemA}</LifeSGAccordion.Item>
            <LifeSGAccordion.Item title="How are refunds processed?">{itemB}</LifeSGAccordion.Item>
            <LifeSGAccordion.Item title="How do I contact support?">{itemC}</LifeSGAccordion.Item>
          </LifeSGAccordion>
        </div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="small">type=&quot;small&quot;</code>
        <div className="mt-2">
          <LifeSGAccordion>
            <LifeSGAccordion.Item title="Can I reschedule?" type="small">{itemA}</LifeSGAccordion.Item>
            <LifeSGAccordion.Item title="How are refunds processed?" type="small">{itemB}</LifeSGAccordion.Item>
          </LifeSGAccordion>
        </div>
      </div>
    </div>
  );
}
