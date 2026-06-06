"use client";

import {
  PredictiveTextInput,
  FormPredictiveTextInput,
} from "@/components/ui/predictive-text-input";
import { Form as LifeSGForm } from "@lifesg/react-design-system/form";
import { PredictiveTextInput as LifeSGPredictiveTextInput } from "@lifesg/react-design-system/predictive-text-input";

const districts = [
  "Ang Mo Kio",
  "Bedok",
  "Bishan",
  "Bukit Batok",
  "Bukit Merah",
  "Bukit Panjang",
  "Bukit Timah",
  "Choa Chu Kang",
  "Clementi",
  "Hougang",
  "Jurong East",
  "Jurong West",
  "Kallang",
  "Marine Parade",
  "Pasir Ris",
  "Punggol",
  "Queenstown",
  "Sembawang",
  "Sengkang",
  "Serangoon",
  "Tampines",
  "Toa Payoh",
  "Woodlands",
  "Yishun",
];

const lookup = async (q: string): Promise<string[]> => {
  await new Promise((r) => setTimeout(r, 200));
  return districts.filter((d) => d.toLowerCase().includes(q.toLowerCase()));
};

export function OursPane() {
  return (
    <div className="flex flex-col gap-8" data-testid="form-predictive-text-input-ours">
      <section>
        <code className="text-xs text-muted-foreground">standalone</code>
        <div className="mt-3 max-w-md">
          <PredictiveTextInput<string, string>
            placeholder="Type at least 3 characters"
            fetchOptions={lookup}
            listExtractor={(s) => s}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">inside FormField</code>
        <div className="mt-3 max-w-md">
          <FormPredictiveTextInput<string, string>
            label="District"
            description="Singapore HDB region"
            placeholder="Try 'Bukit'"
            fetchOptions={lookup}
            listExtractor={(s) => s}
            minimumCharacters={2}
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8" data-testid="form-predictive-text-input-lifesg">
      <section>
        <code className="text-xs text-muted-foreground">standalone</code>
        <div className="mt-3 max-w-md">
          <LifeSGPredictiveTextInput
            placeholder="Type at least 3 characters"
            fetchOptions={lookup}
            listExtractor={(s: string) => s}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">inside FormField</code>
        <div className="mt-3 max-w-md">
          <LifeSGForm.PredictiveTextInput
            label="District"
            placeholder="Try 'Bukit'"
            fetchOptions={lookup}
            listExtractor={(s: string) => s}
            minimumCharacters={2}
          />
        </div>
      </section>
    </div>
  );
}
