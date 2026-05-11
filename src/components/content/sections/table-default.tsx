"use client";

import { Table } from "@/components/ui/table";
import { Table as LifeSGTable } from "@lifesg/react-design-system/table";

const rows = [
  { id: "APT-001", name: "Tampines branch", date: "12 May 2026", time: "2:30 pm", status: "Confirmed" },
  { id: "APT-002", name: "Bedok branch",    date: "14 May 2026", time: "10:00 am", status: "Pending" },
  { id: "APT-003", name: "Woodlands branch", date: "20 May 2026", time: "4:00 pm",  status: "Confirmed" },
  { id: "APT-004", name: "Jurong branch",    date: "22 May 2026", time: "9:15 am",  status: "Cancelled" },
];

export function OursPane() {
  return (
    <div className="max-w-2xl" data-token="default">
      <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Branch</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell><code className="text-xs">{r.id}</code></Table.Cell>
                <Table.Cell>{r.name}</Table.Cell>
                <Table.Cell>{r.date}</Table.Cell>
                <Table.Cell>{r.time}</Table.Cell>
                <Table.Cell>{r.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.Container>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="max-w-2xl" data-token="default">
      <LifeSGTable.Container>
        <LifeSGTable>
          <LifeSGTable.Head>
            <LifeSGTable.Row>
              <LifeSGTable.HeaderCell>ID</LifeSGTable.HeaderCell>
              <LifeSGTable.HeaderCell>Branch</LifeSGTable.HeaderCell>
              <LifeSGTable.HeaderCell>Date</LifeSGTable.HeaderCell>
              <LifeSGTable.HeaderCell>Time</LifeSGTable.HeaderCell>
              <LifeSGTable.HeaderCell>Status</LifeSGTable.HeaderCell>
            </LifeSGTable.Row>
          </LifeSGTable.Head>
          <LifeSGTable.Body>
            {rows.map((r) => (
              <LifeSGTable.Row key={r.id}>
                <LifeSGTable.Cell><code style={{ fontSize: "0.75rem" }}>{r.id}</code></LifeSGTable.Cell>
                <LifeSGTable.Cell>{r.name}</LifeSGTable.Cell>
                <LifeSGTable.Cell>{r.date}</LifeSGTable.Cell>
                <LifeSGTable.Cell>{r.time}</LifeSGTable.Cell>
                <LifeSGTable.Cell>{r.status}</LifeSGTable.Cell>
              </LifeSGTable.Row>
            ))}
          </LifeSGTable.Body>
        </LifeSGTable>
      </LifeSGTable.Container>
    </div>
  );
}
