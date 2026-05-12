"use client";

import { useState } from "react";
import { Select, FormSelect } from "@/components/ui/select";
import { Form } from "@lifesg/react-design-system/form";
import { InputSelect as LifeSGInputSelect } from "@lifesg/react-design-system/input-select";

const FRUITS = [
  { value: "apple",      label: "Apple"      },
  { value: "banana",     label: "Banana"     },
  { value: "cherry",     label: "Cherry"     },
  { value: "durian",     label: "Durian"     },
  { value: "elderberry", label: "Elderberry" },
];

export function OursPane() {
  const [a, setA] = useState<typeof FRUITS[number] | null>(null);
  const [b, setB] = useState<typeof FRUITS[number] | null>(FRUITS[1]);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormSelect (label + description)</code>
        <div className="mt-3">
          <FormSelect
            label="Favourite fruit"
            description="Pick one."
            options={FRUITS}
            selectedOption={a}
            onSelectOption={(opt) => setA(opt)}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled (Banana)</code>
        <div className="mt-3">
          <Select
            options={FRUITS}
            selectedOption={b}
            onSelectOption={(opt) => setB(opt)}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <Select options={FRUITS} selectedOption={FRUITS[2]} disabled />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState<typeof FRUITS[number] | undefined>(undefined);
  const [b, setB] = useState<typeof FRUITS[number] | undefined>(FRUITS[1]);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.Select</code>
        <div className="mt-3">
          <Form.Select<typeof FRUITS[number], string>
            label={{ children: "Favourite fruit", subtitle: "Pick one." }}
            options={FRUITS}
            selectedOption={a}
            onSelectOption={(opt) => setA(opt)}
            valueExtractor={(o) => o.value}
            listExtractor={(o) => o.label}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled (Banana)</code>
        <div className="mt-3">
          <LifeSGInputSelect<typeof FRUITS[number], string>
            options={FRUITS}
            selectedOption={b}
            onSelectOption={(opt) => setB(opt)}
            valueExtractor={(o) => o.value}
            listExtractor={(o) => o.label}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGInputSelect<typeof FRUITS[number], string>
            options={FRUITS}
            selectedOption={FRUITS[2]}
            disabled
            valueExtractor={(o) => o.value}
            listExtractor={(o) => o.label}
          />
        </div>
      </section>
    </div>
  );
}
