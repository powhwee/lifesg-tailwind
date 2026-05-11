import { Border, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };
const widthKeys = ["width-005", "width-010", "width-020", "width-040"] as const;

function resolve(key: string): string {
  /* Border also exports a non-resolver `Util` namespace, so the union type doesn't
   * narrow to a plain string-resolver map — go via `unknown` to bypass. */
  return (Border as unknown as Record<string, (p: typeof lightProps) => string>)[key](lightProps);
}

function Line({ label, value, display }: { label: string; value: string; display: string }) {
  return (
    <div className="flex items-center gap-4">
      <code className="text-xs text-muted-foreground w-48 shrink-0 whitespace-nowrap">{label}</code>
      <div
        className="w-48"
        style={{ borderTopColor: "var(--lifesg-text)", borderTopStyle: "solid", borderTopWidth: value }}
        data-token={label}
      />
      <span className="text-xs text-muted-foreground tabular-nums">{display}</span>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const labelOf = (k: string) => (source === "ours" ? `--lifesg-border-${k}` : `Border.${k}`);
  const valueOf = (k: string) => (source === "ours" ? `var(--lifesg-border-${k})` : resolve(k));
  const displayOf = (k: string) => resolve(k);
  return (
    <div className="flex flex-col gap-3">
      {widthKeys.map((k) => (
        <Line key={k} label={labelOf(k)} value={valueOf(k)} display={displayOf(k)} />
      ))}
      <div className="text-xs text-muted-foreground pt-4">
        <strong>solid</strong>: <code>{displayOf("solid")}</code> — referenced by component CSS
        that builds full border declarations.
      </div>
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
