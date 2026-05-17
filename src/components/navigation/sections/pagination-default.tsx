"use client";

import * as React from "react";
import { Pagination } from "@/components/ui/pagination";
import { Pagination as LifeSGPagination } from "@lifesg/react-design-system/pagination";

export function OursPane() {
  const [page, setPage] = React.useState(5);
  const [pageWindowed, setPageWindowed] = React.useState(15);
  const [pageWithSize, setPageWithSize] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground">default — active = 5</code>
        <div className="mt-2" data-token="default">
          <Pagination totalItems={100} pageSize={10} activePage={page} onPageChange={setPage} />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">long range with ellipsis</code>
        <div className="mt-2" data-token="ellipsis">
          <Pagination
            totalItems={300}
            pageSize={10}
            activePage={pageWindowed}
            onPageChange={setPageWindowed}
            showFirstAndLastNav
          />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">with page-size changer</code>
        <div className="mt-2" data-token="size-changer">
          <Pagination
            totalItems={100}
            pageSize={pageSize}
            activePage={pageWithSize}
            onPageChange={setPageWithSize}
            onPageSizeChange={(p, s) => { setPageWithSize(p); setPageSize(s); }}
            showPageSizeChanger
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [page, setPage] = React.useState(5);
  const [pageWindowed, setPageWindowed] = React.useState(15);
  const [pageWithSize, setPageWithSize] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground">default — active = 5</code>
        <div className="mt-2" data-token="default">
          <LifeSGPagination totalItems={100} pageSize={10} activePage={page} onPageChange={setPage} />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">long range with ellipsis</code>
        <div className="mt-2" data-token="ellipsis">
          <LifeSGPagination
            totalItems={300}
            pageSize={10}
            activePage={pageWindowed}
            onPageChange={setPageWindowed}
            showFirstAndLastNav
          />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">with page-size changer</code>
        <div className="mt-2" data-token="size-changer">
          <LifeSGPagination
            totalItems={100}
            pageSize={pageSize}
            activePage={pageWithSize}
            onPageChange={setPageWithSize}
            onPageSizeChange={(p, s) => { setPageWithSize(p); setPageSize(s); }}
            showPageSizeChanger
          />
        </div>
      </section>
    </div>
  );
}
