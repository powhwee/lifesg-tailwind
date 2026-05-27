import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./footer";

const meta: Meta<typeof Footer> = {
  title: "Navigation/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Footer>;

const sampleLinks = [
  [
    { href: "#about", children: "About LifeSG" },
    { href: "#services", children: "Services" },
    { href: "#help", children: "Help & support" },
  ],
  [
    { href: "#partners", children: "Partner with us" },
    { href: "#feedback", children: "Give feedback" },
    { href: "#changelog", children: "What's new" },
  ],
];

export const Default: Story = {
  render: () => (
    <Footer
      links={sampleLinks}
      copyrightInfo="© 2026 Government of Singapore"
    />
  ),
};

export const NoLogo: Story = {
  render: () => (
    <Footer
      hideLogo
      links={sampleLinks}
      copyrightInfo="© 2026 Government of Singapore"
    />
  ),
};

export const MinimalDisclaimerOnly: Story = {
  render: () => (
    <Footer copyrightInfo="© 2026 Government of Singapore" />
  ),
};

export const CustomDisclaimerLinks: Story = {
  render: () => (
    <Footer
      links={sampleLinks}
      copyrightInfo="© 2026 LifeSG"
      disclaimerLinks={{
        privacy: { href: "https://www.life.gov.sg/privacy-statement" },
        termsOfUse: { href: "https://www.life.gov.sg/terms-of-use" },
        reportVulnerability: { href: "https://www.tech.gov.sg/report_vulnerability" },
      }}
    />
  ),
};
