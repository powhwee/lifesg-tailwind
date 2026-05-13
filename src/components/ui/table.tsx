import * as React from "react";
import { cn } from "@/lib/utils";

function TableContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "rounded-table overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function TableRoot({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      data-slot="table"
      className={cn("w-full border-collapse text-base", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      data-slot="table-head"
      className={cn("bg-table-head-bg", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="table-body" className={cn("", className)} {...props} />;
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-table-row-border last:border-0 hover:bg-table-row-bg-hover",
        className
      )}
      {...props}
    />
  );
}

function TableHeaderCell({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-header-cell"
      scope={props.scope ?? "col"}
      className={cn(
        "text-left font-bold px-table-cell-x first:pl-table-cell-x-first py-table-head-y text-table-head-text",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-table-cell-x first:pl-table-cell-x-first py-table-cell-y align-top",
        className
      )}
      {...props}
    />
  );
}

const Composite = Object.assign(TableRoot, {
  Container: TableContainer,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});

export { Composite as Table };
