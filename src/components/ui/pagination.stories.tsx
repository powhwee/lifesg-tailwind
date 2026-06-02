import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function ControlledPagination({
  initial = 1,
  ...rest
}: Omit<React.ComponentProps<typeof Pagination>, "activePage" | "onPageChange" | "onPageSizeChange" | "pageSize"> & {
  initial?: number;
  pageSize?: number;
}) {
  const [page, setPage] = React.useState(initial);
  const [size, setSize] = React.useState(rest.pageSize ?? 10);
  return (
    <Pagination
      {...rest}
      activePage={page}
      pageSize={size}
      onPageChange={setPage}
      onPageSizeChange={(p, s) => {
        setPage(p);
        setSize(s);
      }}
    />
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledPagination totalItems={250} />,
};

export const FewPages: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledPagination totalItems={45} />,
};

export const ManyPages: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledPagination totalItems={2400} initial={42} />,
};

export const WithFirstLastNav: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledPagination totalItems={500} initial={5} showFirstAndLastNav />
  ),
};

export const WithPageSizeChanger: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledPagination
      totalItems={500}
      initial={1}
      showPageSizeChanger
      pageSizeOptions={[
        { value: 10, label: "10 per page" },
        { value: 25, label: "25 per page" },
        { value: 50, label: "50 per page" },
        { value: 100, label: "100 per page" },
      ]}
    />
  ),
};

export const SinglePage: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledPagination totalItems={5} />,
};
