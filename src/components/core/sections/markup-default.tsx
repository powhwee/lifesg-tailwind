"use client";

import { Markup as OurMarkup } from "@/components/ui/markup";
import { Markup as LifeSGMarkup } from "@lifesg/react-design-system/markup";

const cmsHtml = `
  <h2>Singapore citizens</h2>
  <p>You can apply for the scheme if you meet <strong>all</strong> of the following:</p>
  <ul>
    <li>You are a Singapore citizen aged 21 or older.</li>
    <li>You have not received this benefit in the last 12 months.</li>
    <li>Your <em>annual household income</em> does not exceed S$80,000.</li>
  </ul>
  <h3>How to apply</h3>
  <ol>
    <li>Sign in with <a href="#">Singpass</a>.</li>
    <li>Complete the application form.</li>
    <li>Submit supporting documents.</li>
  </ol>
  <p>For questions, contact <code>support@example.gov.sg</code>.</p>
`;

export function OursPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-2">no baseTextSize (inherit)</h3>
        <div className="border border-border rounded p-4" data-token="markup-md">
          <OurMarkup dangerouslySetInnerHTML={{ __html: cmsHtml }} />
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">baseTextSize=&quot;sm&quot;</h3>
        <div className="border border-border rounded p-4" data-token="markup-sm">
          <OurMarkup baseTextSize="sm" dangerouslySetInnerHTML={{ __html: cmsHtml }} />
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">baseTextColor=&quot;var(--lifesg-text-subtle)&quot;</h3>
        <div className="border border-border rounded p-4" data-token="markup-tinted">
          <OurMarkup
            baseTextColor="var(--lifesg-text-subtle)"
            dangerouslySetInnerHTML={{ __html: cmsHtml }}
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-2">no baseTextSize (inherit)</h3>
        <div className="border border-border rounded p-4" data-token="markup-md">
          <LifeSGMarkup dangerouslySetInnerHTML={{ __html: cmsHtml }} />
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">baseTextSize=&quot;body-sm&quot;</h3>
        <div className="border border-border rounded p-4" data-token="markup-sm">
          <LifeSGMarkup baseTextSize="body-sm" dangerouslySetInnerHTML={{ __html: cmsHtml }} />
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">baseTextColor (theme fn)</h3>
        <div className="border border-border rounded p-4" data-token="markup-tinted">
          <LifeSGMarkup
            baseTextColor={() => "#393939"}
            dangerouslySetInnerHTML={{ __html: cmsHtml }}
          />
        </div>
      </section>
    </div>
  );
}
