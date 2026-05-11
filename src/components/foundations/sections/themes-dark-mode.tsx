"use client";

import { useState, useEffect } from "react";

/* Both panes show the same chrome — the only difference is which token source they read from.
 * The dark/light toggle mutates `documentElement.classList`, which our CSS uses to swap the
 * `.dark` block in `lifesg-tokens.css`. LifeSG's pane re-renders with the resolver's dark theme. */

function Card({ title, source }: { title: string; source: "ours" | "lifesg" }) {
  return (
    <div className="rounded-md border border-border p-4 bg-[var(--lifesg-bg)] text-[var(--lifesg-text)]">
      <div className="text-xs uppercase tracking-wide text-[var(--lifesg-text-subtle)] mb-2">{title}</div>
      <div className="space-y-2 text-sm">
        <div>Background: <code className="text-xs">{source === "ours" ? "var(--lifesg-bg)" : "Colour.bg"}</code></div>
        <div>Text: <code className="text-xs">{source === "ours" ? "var(--lifesg-text)" : "Colour.text"}</code></div>
        <div>
          <button
            className="rounded px-3 py-1.5 text-xs bg-[var(--lifesg-bg-primary)] text-[var(--lifesg-text-inverse)]"
            type="button"
          >
            Primary
          </button>
        </div>
        <div>
          <span className="rounded border border-[var(--lifesg-border)] px-2 py-1 text-xs">
            Bordered
          </span>
        </div>
      </div>
    </div>
  );
}

export function Toggle() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => { document.documentElement.classList.remove("dark"); };
  }, [isDark]);
  return (
    <div className="fixed top-3 right-6 z-10">
      <button
        type="button"
        onClick={() => setIsDark((d) => !d)}
        className="rounded border border-border px-3 py-1.5 text-xs bg-[var(--lifesg-bg)] hover:bg-[var(--lifesg-bg-hover)]"
      >
        Toggle {isDark ? "light" : "dark"}
      </button>
    </div>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-4">
      <Toggle />
      <p className="text-xs text-muted-foreground">
        Reads from CSS vars in <code>:root</code> (light) and <code>.dark</code> (dark) blocks of{" "}
        <code>lifesg-tokens.css</code>.
      </p>
      <Card title="Ours" source="ours" />
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        LifeSG&rsquo;s <code>ThemeProvider</code> in this app is fixed to <code>LifeSGTheme.light</code> in{" "}
        <code>components/compare/lifesg-provider.tsx</code> — toggle above only affects the left
        pane. The point: our <code>.dark</code> CSS class achieves the same outcome as swapping
        LifeSG&rsquo;s theme prop, without a styled-components context.
      </p>
      <Card title="LifeSG (fixed light)" source="lifesg" />
    </div>
  );
}
