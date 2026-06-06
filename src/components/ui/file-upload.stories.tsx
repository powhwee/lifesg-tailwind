import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload, type FileItemProps } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Form/FileUpload",
  component: FileUpload,
  argTypes: {
    styleType: { control: "select", options: ["bordered", "no-border"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    sortable: { control: "boolean" },
    editableFileItems: { control: "boolean" },
    multiple: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

const sample: FileItemProps[] = [
  {
    id: "1",
    name: "Photo of NRIC.jpg",
    type: "image/jpeg",
    size: 482_910,
    description: "Front side, well lit",
  },
  {
    id: "2",
    name: "Supporting document.pdf",
    type: "application/pdf",
    size: 1_192_004,
  },
];

const withProgress: FileItemProps[] = [
  { id: "3", name: "Uploading…", type: "image/png", size: 800_000, progress: 0.42 },
];

const withError: FileItemProps[] = [
  {
    id: "4",
    name: "Too-large file.zip",
    type: "application/zip",
    size: 25_000_000,
    errorMessage: "File exceeds the 10 MB limit.",
  },
];

export const Default: Story = {
  args: {
    title: "Upload your supporting documents",
    description: "PDF, JPG or PNG · 10 MB max per file.",
    fileItems: sample,
  },
};

export const NoBorder: Story = {
  args: { ...Default.args, styleType: "no-border" },
};

export const WithProgress: Story = {
  args: { title: "Uploading…", fileItems: withProgress },
};

export const WithErrors: Story = {
  args: {
    title: "We hit an issue with one file",
    fileItems: withError,
    errorMessage: "Please remove the file above and re-upload.",
  },
};

export const ReadOnly: Story = {
  args: { title: "Submitted documents", fileItems: sample, readOnly: true },
};

export const Sortable: Story = {
  args: { title: "Drag to reorder", fileItems: sample, sortable: true },
};

export const EditableDescriptions: Story = {
  args: {
    title: "Describe each image",
    fileItems: sample,
    editableFileItems: true,
    fileDescriptionMaxLength: 80,
  },
};

export const WithWarning: Story = {
  args: {
    title: "Optional upload",
    fileItems: sample,
    warning: "We recommend uploading at least one supporting document.",
  },
};
