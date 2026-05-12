"use client";

import { useState } from "react";
import { MultiSelect, FormMultiSelect } from "@/components/ui/multi-select";
import { Form } from "@lifesg/react-design-system/form";
import { InputMultiSelect as LifeSGInputMultiSelect } from "@lifesg/react-design-system/input-multi-select";

const TOPPINGS = [
  { value: "cheese",      label: "Cheese"      },
  { value: "pepperoni",   label: "Pepperoni"   },
  { value: "mushrooms",   label: "Mushrooms"   },
  { value: "onions",      label: "Onions"      },
  { value: "olives",      label: "Olives"      },
  { value: "pineapple",   label: "Pineapple"   },
  { value: "anchovies",   label: "Anchovies"   },
];

export function OursPane() {
  const [a, setA] = useState<typeof TOPPINGS[number][]>([]);
  const [b, setB] = useState<typeof TOPPINGS[number][]>([TOPPINGS[0], TOPPINGS[1]]);
  const [capped, setCapped] = useState<typeof TOPPINGS[number][]>([]);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormMultiSelect (label + description)</code>
        <div className="mt-3">
          <FormMultiSelect
            label="Pizza toppings"
            description="Select all that apply."
            options={TOPPINGS}
            selectedOptions={a}
            onSelectOptions={setA}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled (Cheese + Pepperoni)</code>
        <div className="mt-3">
          <MultiSelect
            options={TOPPINGS}
            selectedOptions={b}
            onSelectOptions={setB}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">maxSelectable=3</code>
        <div className="mt-3">
          <MultiSelect
            options={TOPPINGS}
            selectedOptions={capped}
            onSelectOptions={setCapped}
            maxSelectable={3}
            placeholder="Pick up to 3"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            selected: <code>{capped.length}</code> / 3
          </p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <MultiSelect options={TOPPINGS} selectedOptions={[TOPPINGS[3]]} disabled />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState<typeof TOPPINGS[number][]>([]);
  const [b, setB] = useState<typeof TOPPINGS[number][]>([TOPPINGS[0], TOPPINGS[1]]);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.MultiSelect</code>
        <div className="mt-3">
          <Form.MultiSelect<typeof TOPPINGS[number], string>
            label={{ children: "Pizza toppings", subtitle: "Select all that apply." }}
            options={TOPPINGS}
            selectedOptions={a}
            onSelectOptions={setA}
            valueExtractor={(o) => o.value}
            listExtractor={(o) => o.label}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled (Cheese + Pepperoni)</code>
        <div className="mt-3">
          <LifeSGInputMultiSelect<typeof TOPPINGS[number], string>
            options={TOPPINGS}
            selectedOptions={b}
            onSelectOptions={setB}
            valueExtractor={(o) => o.value}
            listExtractor={(o) => o.label}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGInputMultiSelect<typeof TOPPINGS[number], string>
            options={TOPPINGS}
            selectedOptions={[TOPPINGS[3]]}
            disabled
            valueExtractor={(o) => o.value}
            listExtractor={(o) => o.label}
          />
        </div>
      </section>
    </div>
  );
}
