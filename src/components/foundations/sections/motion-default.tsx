import { Motion, LifeSGTheme } from "@lifesg/react-design-system/theme";

const lightProps = { theme: LifeSGTheme.light };
const durationKeys = ["duration-150", "duration-250", "duration-350", "duration-500", "duration-800", "duration-1000"] as const;
const easeKeys = ["ease-default", "ease-standard", "ease-entrance", "ease-exit"] as const;

function resolve(key: string): string {
  return (Motion as Record<string, (p: typeof lightProps) => string>)[key](lightProps);
}

function DurationRow({ label, value, display }: { label: string; value: string; display: string }) {
  return (
    <div className="flex items-center gap-4">
      <code className="text-xs text-muted-foreground w-52 shrink-0 whitespace-nowrap">{label}</code>
      <div
        className="h-3 w-3 rounded-full bg-[var(--lifesg-bg-primary)] motion-slide"
        style={{ animationDuration: value }}
        data-token={label}
      />
      <span className="text-xs text-muted-foreground tabular-nums">{display}</span>
    </div>
  );
}

function EaseRow({ label, value, display }: { label: string; value: string; display: string }) {
  return (
    <div className="flex items-center gap-4">
      <code className="text-xs text-muted-foreground w-52 shrink-0 whitespace-nowrap">{label}</code>
      <div
        className="h-3 w-3 rounded-full bg-[var(--lifesg-bg-primary)] motion-slide"
        style={{ animationDuration: "1500ms", animationTimingFunction: value }}
        data-token={label}
      />
      <span className="text-[10px] text-muted-foreground font-mono">{display}</span>
    </div>
  );
}

function Pane({ source }: { source: "ours" | "lifesg" }) {
  const labelOf = (k: string) => (source === "ours" ? `--lifesg-motion-${k}` : `Motion.${k}`);
  const valueOf = (k: string) => (source === "ours" ? `var(--lifesg-motion-${k})` : resolve(k));
  const displayOf = (k: string) => resolve(k);
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="text-sm font-semibold mb-3">Durations</h3>
        <div className="flex flex-col gap-2 overflow-hidden">
          {durationKeys.map((k) => (
            <DurationRow key={k} label={labelOf(k)} value={valueOf(k)} display={displayOf(k)} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Easings</h3>
        <div className="flex flex-col gap-2 overflow-hidden">
          {easeKeys.map((k) => (
            <EaseRow key={k} label={labelOf(k)} value={valueOf(k)} display={displayOf(k)} />
          ))}
        </div>
      </section>
    </div>
  );
}

export const OursPane = () => <Pane source="ours" />;
export const LifeSGPane = () => <Pane source="lifesg" />;
