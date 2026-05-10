"use client";

import { ThemeProvider } from "styled-components";
import { LifeSGTheme } from "@lifesg/react-design-system/theme";
import type { ReactNode } from "react";

export function LifeSGProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={LifeSGTheme.light}>{children}</ThemeProvider>;
}
