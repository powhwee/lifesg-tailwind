import type { Preview, Decorator } from "@storybook/react";
import React from "react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { Open_Sans, Geist_Mono } from "next/font/google";

import "../src/app/globals.css";

// Match src/app/layout.tsx so Storybook renders with the same fonts the
// Next app uses. Without this, the iframe's <html> never gets the
// `--font-sans` variable Next normally binds on it, and stories fall
// back to the browser default (serif on macOS). The LifeSG body token
// `--lifesg-font-body-font-family: Open Sans` is just a string and
// also needs the actual font to be loaded.
const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Apply the font className+variable to the iframe <html>, same shape as
// RootLayout in src/app/layout.tsx.
const withAppFonts: Decorator = (Story) => {
  if (typeof document !== "undefined") {
    const cls = `${openSans.variable} ${geistMono.variable} antialiased`;
    for (const c of cls.split(/\s+/)) {
      if (c) document.documentElement.classList.add(c);
    }
  }
  return React.createElement(Story);
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      // Top-level sidebar order — mirrors the LifeSG canonical Storybook
      // sequence (`Getting started → Foundations → Core → Content →
      // Navigation → Selection and input → Overlays → Form`). Within each
      // top-level group, sub-groups + stories sort alphabetically (default
      // Storybook behaviour). Anything not listed here lands at the end.
      storySort: {
        order: [
          "Getting Started",
          "Foundations",
          "Core",
          "Content",
          "Navigation",
          "Selection and input",
          "Overlays",
          "Form",
        ],
      },
    },
  },
  decorators: [
    withAppFonts,
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
