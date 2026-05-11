"use client";

import * as React from "react";
import { DataTable, type SortIndicatorsProps, type RowProps } from "@/components/ui/data-table";
import { DataTable as LifeSGDataTable } from "@lifesg/react-design-system/data-table";

const baseRows: RowProps[] = [
  { id: "APT-001", branch: "Tampines",  date: "2026-05-12", time: "2:30 pm",  status: "Confirmed" },
  { id: "APT-002", branch: "Bedok",     date: "2026-05-14", time: "10:00 am", status: "Pending"   },
  { id: "APT-003", branch: "Woodlands", date: "2026-05-20", time: "4:00 pm",  status: "Confirmed" },
  { id: "APT-004", branch: "Jurong",    date: "2026-05-22", time: "9:15 am",  status: "Cancelled" },
];

const headers = [
  { fieldKey: "id",     label: "ID",     clickable: true, keyColumn: true },
  { fieldKey: "branch", label: "Branch", clickable: true },
  { fieldKey: "date",   label: "Date",   clickable: true },
  { fieldKey: "time",   label: "Time" },
  { fieldKey: "status", label: "Status" },
];

function sortRows(rows: RowProps[], indicators: SortIndicatorsProps): RowProps[] {
  const [key, dir] = Object.entries(indicators)[0] ?? [];
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    const av = String(a[key] ?? "");
    const bv = String(b[key] ?? "");
    return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });
}

function OursSortable() {
  const [indicators, setIndicators] = React.useState<SortIndicatorsProps>({ id: "asc" });
  const onHeaderClick = (k: string) => {
    setIndicators((prev) => {
      const cur = prev[k];
      const next = cur === "asc" ? "desc" : "asc";
      return { [k]: next };
    });
  };
  return (
    <DataTable
      headers={headers}
      rows={sortRows(baseRows, indicators)}
      sortIndicators={indicators}
      onHeaderClick={onHeaderClick}
    />
  );
}

function OursMultiSelect() {
  const [selected, setSelected] = React.useState<string[]>([]);
  return (
    <DataTable
      headers={headers}
      rows={baseRows}
      enableMultiSelect
      enableSelectAll
      enableActionBar
      alternatingRows
      selectedIds={selected}
      onSelect={(id, isSel) => setSelected((s) => (isSel ? [...s, id] : s.filter((x) => x !== id)))}
      onSelectAll={(allSel) => setSelected(allSel ? baseRows.map((r) => String(r.id)) : [])}
      onClearSelectionClick={() => setSelected([])}
      actionBarContent={
        <button type="button" className="text-sm font-semibold text-[var(--lifesg-text-primary)] hover:underline cursor-pointer">
          Export
        </button>
      }
    />
  );
}

function OursLoading() {
  return <DataTable headers={headers} rows={[]} loadState="loading" />;
}

function OursEmpty() {
  return <DataTable headers={headers} rows={[]} />;
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <code className="text-xs text-muted-foreground" data-token="sortable">sortable headers</code>
        <div className="mt-2"><OursSortable /></div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="multi-select">multi-select + action bar + alternating rows</code>
        <div className="mt-2"><OursMultiSelect /></div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="loading">loadState=&quot;loading&quot;</code>
        <div className="mt-2"><OursLoading /></div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="empty">empty (default no-item-found)</code>
        <div className="mt-2"><OursEmpty /></div>
      </div>
    </div>
  );
}

function LifeSGSortable() {
  const [indicators, setIndicators] = React.useState<SortIndicatorsProps>({ id: "asc" });
  const onHeaderClick = (k: string) => {
    setIndicators((prev) => {
      const cur = prev[k];
      const next = cur === "asc" ? "desc" : "asc";
      return { [k]: next } as SortIndicatorsProps;
    });
  };
  return (
    <LifeSGDataTable
      headers={headers}
      rows={sortRows(baseRows, indicators)}
      sortIndicators={indicators}
      onHeaderClick={onHeaderClick}
    />
  );
}

function LifeSGMultiSelect() {
  const [selected, setSelected] = React.useState<string[]>([]);
  return (
    <LifeSGDataTable
      headers={headers}
      rows={baseRows}
      enableMultiSelect
      enableSelectAll
      enableActionBar
      alternatingRows
      selectedIds={selected}
      onSelect={(id, isSel) => setSelected((s) => (isSel ? [...s, id] : s.filter((x) => x !== id)))}
      onSelectAll={(allSel) => setSelected(allSel ? baseRows.map((r) => String(r.id)) : [])}
      onClearSelectionClick={() => setSelected([])}
      actionBarContent={
        <button type="button" style={{
          background: "transparent", border: "none", padding: 0,
          color: "var(--lifesg-text-primary)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
        }}>Export</button>
      }
    />
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <code className="text-xs text-muted-foreground" data-token="sortable">sortable headers</code>
        <div className="mt-2"><LifeSGSortable /></div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="multi-select">multi-select + action bar + alternating rows</code>
        <div className="mt-2"><LifeSGMultiSelect /></div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="loading">loadState=&quot;loading&quot;</code>
        <div className="mt-2"><LifeSGDataTable headers={headers} rows={[]} loadState="loading" /></div>
      </div>
      <div>
        <code className="text-xs text-muted-foreground" data-token="empty">empty</code>
        <div className="mt-2"><LifeSGDataTable headers={headers} rows={[]} /></div>
      </div>
    </div>
  );
}
