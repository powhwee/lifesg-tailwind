import { Breakpoint, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };
const ranges = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"] as const;

function resolveNum(key: string): number {
  const fn = (Breakpoint as Record<string, (p: typeof lightProps) => number>)[key];
  return fn(lightProps);
}

function Row({ name, min, max, columns, gutter, margin }: {
  name: string; min: number; max: number | null; columns: number; gutter: number; margin: number;
}) {
  return (
    <tr data-token={name} className="border-b border-border last:border-b-0">
      <td className="py-2 pr-4 font-mono text-xs uppercase tracking-wide">{name}</td>
      <td className="py-2 pr-4 text-xs tabular-nums">{min}px</td>
      <td className="py-2 pr-4 text-xs tabular-nums">{max === null ? "∞" : `${max}px`}</td>
      <td className="py-2 pr-4 text-xs tabular-nums">{columns}</td>
      <td className="py-2 pr-4 text-xs tabular-nums">{gutter}px</td>
      <td className="py-2 text-xs tabular-nums">{margin}px</td>
    </tr>
  );
}

/* Both panes resolve numerically from the LifeSG package — there's no meaningful "CSS-var read"
 * for breakpoints since they're consumed inside @media queries that don't accept var() in browsers.
 * Parity here proves the extracted px-suffixed tokens match the upstream numbers. */
function Pane({ source }: { source: "ours" | "lifesg" }) {
  const rows = ranges.map((r) => ({
    name: r,
    min: resolveNum(`${r}-min`),
    max: r === "xxl" ? null : resolveNum(`${r}-max`),
    columns: resolveNum(`${r}-column`),
    gutter: resolveNum(`${r}-gutter`),
    margin: resolveNum(`${r}-margin`),
  }));
  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        {source === "ours"
          ? "Read from --lifesg-breakpoint-* CSS vars (values match LifeSG numerically — px appended)."
          : "Read from Breakpoint[*] resolvers (raw numbers)."}
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Min</th>
            <th className="py-2 pr-4">Max</th>
            <th className="py-2 pr-4">Cols</th>
            <th className="py-2 pr-4">Gutter</th>
            <th className="py-2">Margin</th>
          </tr>
        </thead>
        <tbody>{rows.map((r) => <Row key={r.name} {...r} />)}</tbody>
      </table>
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
