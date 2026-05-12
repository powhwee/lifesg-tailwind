"use client";

import { useState } from "react";
import { Filter, type FilterCheckboxOption } from "@/components/ui/filter";
import { Filter as LifeSGFilter } from "@lifesg/react-design-system/filter";

const CATEGORY_OPTIONS: FilterCheckboxOption[] = [
  { value: "appointments",  label: "Appointments" },
  { value: "applications",  label: "Applications" },
  { value: "payments",      label: "Payments" },
  { value: "notifications", label: "Notifications" },
  { value: "documents",     label: "Documents" },
];

const STATUS_OPTIONS: FilterCheckboxOption[] = [
  { value: "open",      label: "Open" },
  { value: "pending",   label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
  { value: "archived",  label: "Archived" },
  { value: "draft",     label: "Draft" },
];

export function OursPane() {
  const [category, setCategory] = useState<FilterCheckboxOption[]>([CATEGORY_OPTIONS[0]]);
  const [status, setStatus] = useState<FilterCheckboxOption[]>([]);
  return (
    <div className="flex" data-token="default">
      <Filter onClear={() => { setCategory([]); setStatus([]); }}>
        <Filter.Checkbox
          title="Category"
          options={CATEGORY_OPTIONS}
          selectedOptions={category}
          onSelect={setCategory}
        />
        <Filter.Checkbox
          title="Status"
          options={STATUS_OPTIONS}
          selectedOptions={status}
          onSelect={setStatus}
          minimisableOptions
          minimisedCount={5}
        />
      </Filter>
    </div>
  );
}

export function LifeSGPane() {
  const [category, setCategory] = useState<FilterCheckboxOption[]>([CATEGORY_OPTIONS[0]]);
  const [status, setStatus] = useState<FilterCheckboxOption[]>([]);
  return (
    <div className="flex" data-token="default">
      <LifeSGFilter onClear={() => { setCategory([]); setStatus([]); }}>
        <LifeSGFilter.Checkbox
          title="Category"
          options={CATEGORY_OPTIONS}
          selectedOptions={category}
          onSelect={setCategory}
        />
        <LifeSGFilter.Checkbox
          title="Status"
          options={STATUS_OPTIONS}
          selectedOptions={status}
          onSelect={setStatus}
          minimisableOptions
        />
      </LifeSGFilter>
    </div>
  );
}
