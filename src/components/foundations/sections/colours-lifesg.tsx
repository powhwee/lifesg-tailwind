import { Colour, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };

const primitiveScales = [
  "brand", "primary", "secondary", "neutral", "success", "warning", "error", "info",
] as const;
const stops = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "95", "100"] as const;

const semanticGroups: { label: string; keys: string[] }[] = [
  {
    label: "Text",
    keys: [
      "text", "text-subtle", "text-subtler", "text-subtlest", "text-primary", "text-hover",
      "text-disabled", "text-success", "text-warning", "text-error", "text-info", "text-inverse",
    ],
  },
  {
    label: "Background",
    keys: [
      "bg", "bg-strong", "bg-stronger", "bg-strongest", "bg-hover", "bg-selected", "bg-disabled",
      "bg-primary", "bg-primary-hover", "bg-success-strong", "bg-warning-strong", "bg-error-strong",
      "bg-info-strong", "bg-inverse",
    ],
  },
  {
    label: "Border",
    keys: [
      "border", "border-strong", "border-stronger", "border-primary", "border-hover",
      "border-selected", "border-focus", "border-disabled", "border-success", "border-warning",
      "border-error", "border-info",
    ],
  },
  {
    label: "Icon",
    keys: [
      "icon", "icon-subtle", "icon-strongest", "icon-primary", "icon-hover", "icon-selected",
      "icon-disabled", "icon-success", "icon-warning", "icon-error", "icon-info", "icon-inverse",
    ],
  },
];

function resolvePrimitive(scale: string, stop: string): string {
  const fn = (Colour.Primitive as Record<string, (p: typeof lightProps) => string>)[`${scale}-${stop}`];
  return fn(lightProps);
}

function resolveSemantic(key: string): string {
  /* Colour also nests a `Primitive` sub-namespace, so the union type doesn't
   * narrow to a plain string-resolver map — go via `unknown` to bypass. */
  const fn = (Colour as unknown as Record<string, (p: typeof lightProps) => string>)[key];
  return fn(lightProps);
}

function Swatch({ label, value, display }: { label: string; value: string; display: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-12 w-full rounded border border-border" style={{ background: value }} data-token={label} />
      <code className="text-[10px] text-muted-foreground truncate">{label}</code>
      <code className="text-[10px] text-muted-foreground tabular-nums">{display}</code>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const primitive = (scale: string, stop: string) => ({
    label: source === "ours" ? `--lifesg-${scale}-${stop}` : `${scale}-${stop}`,
    value: source === "ours" ? `var(--lifesg-${scale}-${stop})` : resolvePrimitive(scale, stop),
    display: resolvePrimitive(scale, stop),
  });
  const semantic = (key: string) => ({
    label: source === "ours" ? `--lifesg-${key}` : key,
    value: source === "ours" ? `var(--lifesg-${key})` : resolveSemantic(key),
    display: resolveSemantic(key),
  });
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-3">Primitives</h3>
        <div className="flex flex-col gap-4">
          {primitiveScales.map((scale) => (
            <div key={scale}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{scale}</div>
              <div className="grid grid-cols-11 gap-1">
                {stops.map((stop) => <Swatch key={stop} {...primitive(scale, stop)} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Semantic</h3>
        <div className="flex flex-col gap-4">
          {semanticGroups.map((group) => (
            <div key={group.label}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{group.label}</div>
              <div className="grid grid-cols-4 gap-2">
                {group.keys.map((k) => <Swatch key={k} {...semantic(k)} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
