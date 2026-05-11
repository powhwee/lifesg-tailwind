import { Font, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };

const headingScale = ["xxl", "xl", "lg", "md", "sm", "xs"] as const;
const bodyScale = ["baseline", "md", "sm", "xs"] as const;
const weightKeys = ["light", "regular", "semibold", "bold"] as const;

function resolveSpec(key: string): string {
  return (Font.Spec as Record<string, (p: typeof lightProps) => string>)[key](lightProps);
}

function Specimen({
  label, fontSize, lineHeight, fontWeight, family, sample, displaySize, displayLh, displayWeight,
}: {
  label: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  family: string;
  sample: string;
  displaySize: string;
  displayLh: string;
  displayWeight: string;
}) {
  return (
    <div className="flex flex-col gap-2" data-token={label}>
      <code className="text-[10px] text-muted-foreground">{label}</code>
      <div
        style={{ fontSize, lineHeight, fontWeight, fontFamily: family }}
        className="text-[var(--lifesg-text)]"
      >
        {sample}
      </div>
      <div className="text-[10px] text-muted-foreground tabular-nums">
        {displaySize} / {displayLh} / {displayWeight}
      </div>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const valueOf = (k: string) => (source === "ours" ? `var(--lifesg-font-${k})` : resolveSpec(k));
  const displayOf = (k: string) => resolveSpec(k);
  const family = source === "ours" ? "var(--lifesg-font-family)" : resolveSpec("font-family");
  const semibold = source === "ours" ? "var(--lifesg-font-weight-semibold)" : resolveSpec("weight-semibold");
  const regular = source === "ours" ? "var(--lifesg-font-weight-regular)" : resolveSpec("weight-regular");
  const displaySemibold = resolveSpec("weight-semibold");
  const displayRegular = resolveSpec("weight-regular");

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="text-sm font-semibold mb-3">Heading</h3>
        <div className="flex flex-col gap-5">
          {headingScale.map((s) => (
            <Specimen
              key={s}
              label={source === "ours" ? `--lifesg-font-heading-*-${s}` : `Font.Spec.heading-*-${s}`}
              fontSize={valueOf(`heading-size-${s}`)}
              lineHeight={valueOf(`heading-lh-${s}`)}
              fontWeight={semibold}
              family={family}
              sample={`Heading ${s}`}
              displaySize={displayOf(`heading-size-${s}`)}
              displayLh={displayOf(`heading-lh-${s}`)}
              displayWeight={displaySemibold}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Body</h3>
        <div className="flex flex-col gap-4">
          {bodyScale.map((s) => (
            <Specimen
              key={s}
              label={source === "ours" ? `--lifesg-font-body-*-${s}` : `Font.Spec.body-*-${s}`}
              fontSize={valueOf(`body-size-${s}`)}
              lineHeight={valueOf(`body-lh-${s}`)}
              fontWeight={regular}
              family={family}
              sample={`Body ${s} — the quick brown fox jumps over the lazy dog`}
              displaySize={displayOf(`body-size-${s}`)}
              displayLh={displayOf(`body-lh-${s}`)}
              displayWeight={displayRegular}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Weights</h3>
        <div className="grid grid-cols-2 gap-3">
          {weightKeys.map((w) => (
            <div key={w} className="text-base" style={{ fontFamily: family, fontWeight: valueOf(`weight-${w}`) }}>
              <code className="text-[10px] text-muted-foreground block">
                --lifesg-font-weight-{w} <span className="tabular-nums">({displayOf(`weight-${w}`)})</span>
              </code>
              The quick brown fox
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
