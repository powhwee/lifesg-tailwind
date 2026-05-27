import type { Meta, StoryObj } from "@storybook/react";
import { UneditableSection } from "./uneditable-section";
import { Button } from "./button";

const meta: Meta<typeof UneditableSection> = {
  title: "Content/UneditableSection",
  component: UneditableSection,
  argTypes: {
    background: { control: "boolean" },
    stretch: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UneditableSection>;

const basicItems = [
  { label: "Full name", value: "Tan Mei Ling" },
  { label: "NRIC", value: "S••••567A" },
  { label: "Date of birth", value: "12 March 1988" },
  { label: "Nationality", value: "Singapore Citizen" },
];

export const Default: Story = {
  render: (args) => (
    <div className="w-[40rem]">
      <UneditableSection {...args} items={basicItems} />
    </div>
  ),
};

export const WithHeader: Story = {
  render: (args) => (
    <div className="w-[40rem]">
      <UneditableSection
        {...args}
        title="Personal particulars"
        description="Retrieved from Myinfo. Update via Singpass if anything is incorrect."
        items={basicItems}
      />
    </div>
  ),
};

export const NoBackground: Story = {
  render: (args) => (
    <div className="w-[40rem] bg-lifesg-bg-subtle p-6">
      <UneditableSection
        {...args}
        title="Inline section"
        items={basicItems}
        background={false}
      />
    </div>
  ),
};

export const FullWidthItems: Story = {
  render: (args) => (
    <div className="w-[40rem]">
      <UneditableSection
        {...args}
        title="Addresses"
        items={[
          { label: "Residential", value: "Blk 123 Bedok North Street 4 #04-56, Singapore 460123", displayWidth: "full" },
          { label: "Mailing", value: "Same as residential", displayWidth: "full" },
        ]}
      />
    </div>
  ),
};

export const WithChildrenAndCta: Story = {
  render: (args) => (
    <div className="w-[40rem]">
      <UneditableSection
        {...args}
        title="Contact details"
        items={[
          { label: "Mobile", value: "+65 9123 4567" },
          { label: "Email", value: "tan.meiling@example.sg" },
        ]}
        bottomSection={
          <div className="flex justify-end">
            <Button variant="outline">Update contact</Button>
          </div>
        }
      />
    </div>
  ),
};
