import type { StorybookConfig } from "@storybook/nextjs";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    {
      // SB10 uses MDX 3 which does NOT enable GFM tables by default —
      // `| col | col |` syntax falls through as literal pipes. Wire in
      // remark-gfm so tables, strikethrough, autolinks, and task lists
      // all work in foundation + component MDX docs pages.
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
};

export default config;
