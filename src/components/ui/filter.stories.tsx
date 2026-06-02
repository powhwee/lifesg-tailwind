import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Filter, type FilterCheckboxOption } from "./filter";

const meta: Meta<typeof Filter> = {
  title: "Form/Filter",
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

const services: FilterCheckboxOption[] = [
  { value: "passport", label: "Passport renewal" },
  { value: "ic", label: "Identity card" },
  { value: "bto", label: "HDB BTO" },
  { value: "cpf", label: "CPF nomination" },
  { value: "tax", label: "Tax filing" },
];

const agencies: FilterCheckboxOption[] = [
  { value: "ica", label: "ICA" },
  { value: "hdb", label: "HDB" },
  { value: "cpfb", label: "CPF Board" },
  { value: "iras", label: "IRAS" },
  { value: "moh", label: "MOH" },
  { value: "moe", label: "MOE" },
  { value: "lta", label: "LTA" },
  { value: "mom", label: "MOM" },
];

function ControlledFilter() {
  const [selectedServices, setSelectedServices] = React.useState<FilterCheckboxOption[]>([]);
  const [selectedAgencies, setSelectedAgencies] = React.useState<FilterCheckboxOption[]>([]);
  const hasAny = selectedServices.length > 0 || selectedAgencies.length > 0;
  return (
    <Filter
      onClear={() => {
        setSelectedServices([]);
        setSelectedAgencies([]);
      }}
      clearButtonDisabled={!hasAny}
    >
      <Filter.Checkbox
        title="Service type"
        options={services}
        selectedOptions={selectedServices}
        onSelect={setSelectedServices}
      />
      <Filter.Checkbox
        title="Agency"
        options={agencies}
        selectedOptions={selectedAgencies}
        onSelect={setSelectedAgencies}
        minimisableOptions
        minimisedCount={4}
      />
    </Filter>
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-80">
      <ControlledFilter />
    </div>
  ),
};

export const SingleGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<FilterCheckboxOption[]>([services[0]]);
    return (
      <div className="w-80">
        <Filter
          customLabels={{ headerTitle: "Filter by service" }}
          onClear={() => setSelected([])}
          clearButtonDisabled={selected.length === 0}
        >
          <Filter.Checkbox
            title="Service type"
            options={services}
            selectedOptions={selected}
            onSelect={setSelected}
          />
        </Filter>
      </div>
    );
  },
};

export const WithCustomItem: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-80">
      <Filter onClear={() => {}}>
        <Filter.Item title="Custom field">
          <p className="text-sm text-lifesg-text-subtle mb-3">
            Filter.Item accepts arbitrary children — drop in date pickers,
            range sliders, or anything else inside an accordion section.
          </p>
          <input
            type="text"
            placeholder="Search…"
            className="w-full h-input-height px-3 rounded-input border border-input-border outline-none focus:border-input-border-focus"
          />
        </Filter.Item>
        <Filter.Item title="Static section" collapsible={false}>
          <p className="text-sm">A non-collapsible section — no chevron.</p>
        </Filter.Item>
      </Filter>
    </div>
  ),
};

export const Minimisable: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<FilterCheckboxOption[]>([]);
    return (
      <div className="w-80">
        <Filter
          onClear={() => setSelected([])}
          clearButtonDisabled={selected.length === 0}
        >
          <Filter.Checkbox
            title="Agency (8 options)"
            options={agencies}
            selectedOptions={selected}
            onSelect={setSelected}
            minimisableOptions
            minimisedCount={4}
          />
        </Filter>
      </div>
    );
  },
};
