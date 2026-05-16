import { Spacing, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };

const spacingKeys = [
  "spacing-0", "spacing-4", "spacing-8", "spacing-12", "spacing-16", "spacing-20",
  "spacing-24", "spacing-32", "spacing-40", "spacing-48", "spacing-64", "spacing-72",
] as const;

const layoutKeys = [
  "layout-xs", "layout-sm", "layout-md", "layout-lg", "layout-xl", "layout-xxl", "layout-xxxl",
] as const;

function resolve(key: string): string {
  return (Spacing as Record<string, (p: typeof lightProps) => string>)[key](lightProps);
}

function Bar({ label, value, display }: { label: string; value: string; display: string }) {
  return (
    <div className="flex items-center gap-4">
      <code className="text-xs text-muted-foreground w-44 shrink-0 whitespace-nowrap">{label}</code>
      <div className="h-4 bg-lifesg-bg-primary" style={{ width: value }} data-token={label} />
      <span className="text-xs text-muted-foreground tabular-nums">{display}</span>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const labelOf = (k: string) => (source === "ours" ? `--lifesg-${k}` : `Spacing.${k}`);
  const valueOf = (k: string) => (source === "ours" ? `var(--lifesg-${k})` : resolve(k));
  const displayOf = (k: string) => resolve(k);
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="text-sm font-semibold mb-3">Spacing scale</h3>
        <div className="flex flex-col gap-2">
          {spacingKeys.map((k) => (
            <Bar key={k} label={labelOf(k)} value={valueOf(k)} display={displayOf(k)} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Layout scale</h3>
        <div className="flex flex-col gap-2">
          {layoutKeys.map((k) => (
            <Bar key={k} label={labelOf(k)} value={valueOf(k)} display={displayOf(k)} />
          ))}
        </div>
      </section>
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
