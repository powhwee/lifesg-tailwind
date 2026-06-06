import type { Meta, StoryObj } from "@storybook/react";
import {
  PredictiveTextInput,
  FormPredictiveTextInput,
  type ListItemDisplayProps,
  type PredictiveTextInputProps,
} from "./predictive-text-input";

// The component is generic over <T, V>; the stories pin it to <string, string>
// so the Storybook controls panel has concrete argTypes.
const StringPredictiveTextInput = PredictiveTextInput as (
  props: PredictiveTextInputProps<string, string>,
) => React.ReactNode;

const meta: Meta<typeof StringPredictiveTextInput> = {
  title: "Form/PredictiveTextInput",
  component: StringPredictiveTextInput,
  argTypes: {
    minimumCharacters: { control: { type: "number", min: 1, max: 5 } },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof StringPredictiveTextInput>;

const districts = [
  "Ang Mo Kio",
  "Bedok",
  "Bishan",
  "Bukit Batok",
  "Bukit Merah",
  "Bukit Panjang",
  "Bukit Timah",
  "Choa Chu Kang",
  "Clementi",
  "Hougang",
  "Jurong East",
  "Jurong West",
  "Kallang",
  "Marine Parade",
  "Pasir Ris",
  "Punggol",
  "Queenstown",
  "Sembawang",
  "Sengkang",
  "Serangoon",
  "Tampines",
  "Toa Payoh",
  "Woodlands",
  "Yishun",
];

const lookup = async (q: string): Promise<string[]> => {
  await new Promise((r) => setTimeout(r, 250));
  return districts.filter((d) => d.toLowerCase().includes(q.toLowerCase()));
};

const customLookup = async (q: string): Promise<ListItemDisplayProps[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return districts
    .filter((d) => d.toLowerCase().includes(q.toLowerCase()))
    .map((title) => ({ title, secondaryLabel: `District · ${title}` }));
};

export const Default: Story = {
  args: {
    placeholder: "Type at least 3 characters",
    fetchOptions: lookup,
    listExtractor: (s: string) => s,
    displayValueExtractor: (s: string) => s,
    valueExtractor: (s: string) => s,
    onSelectOption: (item) => console.log("selected", item),
  },
};

export const AsyncFetch: Story = {
  args: {
    placeholder: "Try 'Bukit'",
    fetchOptions: lookup,
    listExtractor: (s: string) => s,
    minimumCharacters: 2,
  },
};

// CustomListItems uses ListItemDisplayProps for T so it gets its own Story type.
const CustomItemPredictiveTextInput = PredictiveTextInput as (
  props: PredictiveTextInputProps<ListItemDisplayProps, string>,
) => React.ReactNode;

export const CustomListItems: StoryObj<typeof CustomItemPredictiveTextInput> = {
  args: {
    placeholder: "Try 'Pasir'",
    fetchOptions: customLookup,
    listExtractor: (item) => item,
    displayValueExtractor: (item) => item.title,
  },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", fetchOptions: lookup, disabled: true },
};

export const ReadOnly: Story = {
  args: { placeholder: "Read-only", fetchOptions: lookup, readOnly: true },
};

export const ErrorState: Story = {
  args: { placeholder: "Error", fetchOptions: lookup, error: true },
};

export const InFormField: StoryObj<typeof FormPredictiveTextInput> = {
  render: () => (
    <FormPredictiveTextInput<string, string>
      label="District"
      description="Singapore HDB region"
      placeholder="Type at least 3 characters"
      fetchOptions={lookup}
      listExtractor={(s) => s}
    />
  ),
};
