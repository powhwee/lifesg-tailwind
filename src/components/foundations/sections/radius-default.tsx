import { Radius, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };
const keys = ["none", "xs", "sm", "md", "lg", "full"] as const;

function resolve(key: string): string {
  return (Radius as Record<string, (p: typeof lightProps) => string>)[key](lightProps);
}

function Box({ label, value, display }: { label: string; value: string; display: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="size-20 bg-[var(--lifesg-bg-primary)]"
        style={{ borderRadius: value }}
        data-token={label}
      />
      <code className="text-xs text-muted-foreground whitespace-nowrap">{label}</code>
      <span className="text-xs text-muted-foreground tabular-nums">{display}</span>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const labelOf = (k: string) => (source === "ours" ? `--lifesg-radius-${k}` : `Radius.${k}`);
  const valueOf = (k: string) => (source === "ours" ? `var(--lifesg-radius-${k})` : resolve(k));
  const displayOf = (k: string) => resolve(k);
  return (
    <div className="grid grid-cols-3 gap-6">
      {keys.map((k) => (
        <Box key={k} label={labelOf(k)} value={valueOf(k)} display={displayOf(k)} />
      ))}
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
