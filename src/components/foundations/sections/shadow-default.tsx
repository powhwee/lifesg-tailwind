import { Shadow, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };
const keys = [
  "xs-subtle", "xs-strong", "xs-focus-strong", "xs-error-strong",
  "sm-subtle", "sm-strong",
  "md-subtle", "md-strong",
  "lg-subtle", "lg-strong",
] as const;

function resolve(key: string): string {
  return (Shadow as Record<string, (p: typeof lightProps) => string>)[key](lightProps);
}

function Card({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="size-24 rounded-md bg-[var(--lifesg-bg)] border border-border"
        style={{ boxShadow: value }}
        data-token={name}
      />
      <code className="text-xs text-muted-foreground">{name}</code>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const valueOf = (k: string) => (source === "ours" ? `var(--lifesg-shadow-${k})` : resolve(k));
  const labelOf = (k: string) => (source === "ours" ? `--lifesg-shadow-${k}` : `Shadow.${k}`);
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-2">
      {keys.map((k) => (
        <Card key={k} name={labelOf(k)} value={valueOf(k)} />
      ))}
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
