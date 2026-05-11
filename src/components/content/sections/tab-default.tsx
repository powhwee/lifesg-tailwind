"use client";

import { Tab } from "@/components/ui/tab";
import { Tab as LifeSGTab } from "@lifesg/react-design-system/tab";

const aBody = (
  <p>
    Open Monday to Friday, 9 am to 5 pm. Closed on Saturdays, Sundays, and public holidays.
    Walk-ins are accepted on a first-come-first-served basis.
  </p>
);
const bBody = (
  <p>
    A non-refundable deposit of S$10 is required at booking. The deposit is returned as a credit
    against the final fee on the day of your appointment.
  </p>
);
const cBody = (
  <p>
    Bring your IC, a recent utility bill, and any prior correspondence from us. If filing on
    behalf of a third party, you&rsquo;ll also need a signed authorisation letter.
  </p>
);

export function OursPane() {
  return (
    <div className="max-w-xl">
      <code className="text-xs text-muted-foreground" data-token="default">default</code>
      <div className="mt-2">
        <Tab>
          <Tab.Item title="Opening hours">{aBody}</Tab.Item>
          <Tab.Item title="Fees">{bBody}</Tab.Item>
          <Tab.Item title="What to bring">{cBody}</Tab.Item>
        </Tab>
      </div>
      <div className="mt-8">
        <code className="text-xs text-muted-foreground" data-token="full-width-line">fullWidthIndicatorLine</code>
        <div className="mt-2">
          <Tab fullWidthIndicatorLine>
            <Tab.Item title="Opening hours">{aBody}</Tab.Item>
            <Tab.Item title="Fees">{bBody}</Tab.Item>
            <Tab.Item title="What to bring">{cBody}</Tab.Item>
          </Tab>
        </div>
      </div>
    </div>
  );
}

export function LifeSGPane() {
  const a = <>{aBody}</>;
  const b = <>{bBody}</>;
  const c = <>{cBody}</>;
  return (
    <div className="max-w-xl">
      <code className="text-xs text-muted-foreground" data-token="default">default</code>
      <div className="mt-2">
        <LifeSGTab>
          <LifeSGTab.Item title="Opening hours">{a}</LifeSGTab.Item>
          <LifeSGTab.Item title="Fees">{b}</LifeSGTab.Item>
          <LifeSGTab.Item title="What to bring">{c}</LifeSGTab.Item>
        </LifeSGTab>
      </div>
      <div className="mt-8">
        <code className="text-xs text-muted-foreground" data-token="full-width-line">fullWidthIndicatorLine</code>
        <div className="mt-2">
          <LifeSGTab fullWidthIndicatorLine>
            <LifeSGTab.Item title="Opening hours">{a}</LifeSGTab.Item>
            <LifeSGTab.Item title="Fees">{b}</LifeSGTab.Item>
            <LifeSGTab.Item title="What to bring">{c}</LifeSGTab.Item>
          </LifeSGTab>
        </div>
      </div>
    </div>
  );
}
