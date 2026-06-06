import type { Meta, StoryObj } from "@storybook/react";
import { FileDownload, type FileItemDownloadProps } from "./file-download";

const meta: Meta<typeof FileDownload> = {
  title: "Form/FileDownload",
  component: FileDownload,
  argTypes: {
    styleType: {
      control: "select",
      options: ["bordered", "no-border"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileDownload>;

const sampleItems: FileItemDownloadProps[] = [
  {
    id: "1",
    name: "Application form.pdf",
    mimeType: "application/pdf",
    size: 348_204,
    filePath: "/files/application.pdf",
  },
  {
    id: "2",
    name: "Proof of address.jpg",
    mimeType: "image/jpeg",
    size: 1_482_910,
    filePath: "/files/proof.jpg",
  },
  {
    id: "3",
    name: "Salary slip — January.pdf",
    mimeType: "application/pdf",
    size: 92_341,
    filePath: "/files/jan-salary.pdf",
  },
];

const itemsWithError: FileItemDownloadProps[] = [
  ...sampleItems,
  {
    id: "4",
    name: "Backup statement.pdf",
    mimeType: "application/pdf",
    size: 540_220,
    filePath: "/files/backup.pdf",
    errorMessage: "File could not be downloaded. Try again later.",
  },
];

const itemsNotReady: FileItemDownloadProps[] = [
  {
    id: "5",
    name: "Pending statement.pdf",
    mimeType: "application/pdf",
    filePath: "/files/pending.pdf",
    ready: false,
  },
];

export const Default: Story = {
  args: {
    title: "Reference documents",
    description: "Download the materials you need to complete your application.",
    fileItems: sampleItems,
    onDownload: async () => {
      await new Promise((r) => setTimeout(r, 300));
    },
  },
};

export const NoBorder: Story = {
  args: {
    ...Default.args,
    styleType: "no-border",
  },
};

export const WithErrors: Story = {
  args: {
    title: "Download attempts with one failure",
    fileItems: itemsWithError,
    onDownload: async () => {
      throw new Error("simulated failure");
    },
  },
};

export const NotReady: Story = {
  args: {
    title: "Statements are still being generated",
    fileItems: itemsNotReady,
  },
};
