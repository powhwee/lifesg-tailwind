import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  DataTable,
  type HeaderProps,
  type RowProps,
  type SortIndicatorsProps,
} from "./data-table";
import { Button } from "./button";

const meta: Meta<typeof DataTable> = {
  title: "Content/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const headers: HeaderProps[] = [
  { fieldKey: "name", label: "Name", keyColumn: true },
  { fieldKey: "agency", label: "Agency" },
  { fieldKey: "deadline", label: "Deadline" },
  { fieldKey: "status", label: "Status" },
];

const rows: RowProps[] = [
  { id: "1", name: "BTO ballot result", agency: "HDB", deadline: "2026-05-30", status: "Pending" },
  { id: "2", name: "CPF nomination update", agency: "CPFB", deadline: "2026-06-15", status: "Pending" },
  { id: "3", name: "Tax filing reminder", agency: "IRAS", deadline: "2026-04-15", status: "Overdue" },
  { id: "4", name: "Passport collection slot", agency: "ICA", deadline: "2026-06-02", status: "Pending" },
  { id: "5", name: "Driving licence renewal", agency: "LTA", deadline: "2026-08-21", status: "Active" },
];

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[48rem]">
      <DataTable headers={headers} rows={rows} />
    </div>
  ),
};

export const WithSorting: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [sort, setSort] = React.useState<SortIndicatorsProps>({ deadline: "asc" });
    const sortable: HeaderProps[] = headers.map((h) =>
      typeof h === "string" ? { fieldKey: h, label: h, clickable: true } : { ...h, clickable: true }
    );
    return (
      <div className="w-[48rem]">
        <DataTable
          headers={sortable}
          rows={rows}
          sortIndicators={sort}
          onHeaderClick={(key) => {
            setSort((cur) => ({ [key]: cur[key] === "asc" ? "desc" : "asc" }));
          }}
        />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    return (
      <div className="w-[48rem]">
        <DataTable
          headers={headers}
          rows={rows}
          enableMultiSelect
          enableSelectAll
          selectedIds={selected}
          onSelect={(rowId, isSelected) => {
            setSelected((cur) =>
              isSelected ? [...cur, rowId] : cur.filter((id) => id !== rowId)
            );
          }}
          onSelectAll={(all) => {
            setSelected(all ? rows.map((r) => String(r.id)) : []);
          }}
        />
      </div>
    );
  },
};

export const WithActionBar: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(["1", "3"]);
    return (
      <div className="w-[48rem]">
        <DataTable
          headers={headers}
          rows={rows}
          enableMultiSelect
          enableSelectAll
          enableActionBar
          selectedIds={selected}
          actionBarContent={
            <>
              <Button variant="outline" size="sm">Archive</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </>
          }
          onSelect={(rowId, isSelected) =>
            setSelected((cur) =>
              isSelected ? [...cur, rowId] : cur.filter((id) => id !== rowId)
            )
          }
          onSelectAll={(all) =>
            setSelected(all ? rows.map((r) => String(r.id)) : [])
          }
          onClearSelectionClick={() => setSelected([])}
        />
      </div>
    );
  },
};

export const DisabledRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    return (
      <div className="w-[48rem]">
        <DataTable
          headers={headers}
          rows={rows}
          enableMultiSelect
          enableSelectAll
          selectedIds={selected}
          disabledIds={["3", "5"]}
          onSelect={(rowId, isSelected) =>
            setSelected((cur) =>
              isSelected ? [...cur, rowId] : cur.filter((id) => id !== rowId)
            )
          }
          onSelectAll={(all) => {
            const eligible = rows
              .filter((r) => !["3", "5"].includes(String(r.id)))
              .map((r) => String(r.id));
            setSelected(all ? eligible : []);
          }}
        />
      </div>
    );
  },
};

export const AlternatingRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[48rem]">
      <DataTable headers={headers} rows={rows} alternatingRows />
    </div>
  ),
};

export const LoadingState: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[48rem]">
      <DataTable headers={headers} rows={[]} loadState="loading" />
    </div>
  ),
};

export const EmptyState: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[48rem]">
      <DataTable headers={headers} rows={[]} />
    </div>
  ),
};

export const CustomCellRender: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const withActions: RowProps[] = rows.slice(0, 3).map((r) => ({
      ...r,
      action: () => (
        <Button variant="outline" size="sm" onClick={() => alert(`Acting on ${r.name}`)}>
          View
        </Button>
      ),
    }));
    return (
      <div className="w-[52rem]">
        <DataTable
          headers={[...headers, { fieldKey: "action", label: "" }]}
          rows={withActions}
        />
      </div>
    );
  },
};
