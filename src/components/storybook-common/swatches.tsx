import type { CSSProperties, ReactNode } from "react";

// Foundation-page helpers — render token tables / swatches for
// MDX-only foundation tours under `Foundations/*`.

export function ColorSwatch({
  token,
  height = 56,
  label,
}: {
  token: string;
  height?: number;
  label?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          height,
          backgroundColor: `var(${token})`,
          borderRadius: 4,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
        aria-hidden
      />
      <code style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
        {label ?? token}
      </code>
    </div>
  );
}

export function ColorRamp({
  prefix,
  steps,
  label,
}: {
  prefix: string;
  steps: (number | string)[];
  label?: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      {label && (
        <div
          style={{
            marginBottom: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--lifesg-text)",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          gap: 8,
        }}
      >
        {steps.map((step) => (
          <ColorSwatch
            key={step}
            token={`--${prefix}-${step}`}
            label={String(step)}
          />
        ))}
      </div>
    </div>
  );
}

export function TokenRow({
  token,
  sample,
}: {
  token: string;
  sample: ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        alignItems: "center",
        gap: 16,
        padding: "12px 0",
        borderBottom: "1px solid var(--lifesg-border)",
      }}
    >
      <code style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
        {token}
      </code>
      <div>{sample}</div>
    </div>
  );
}

export function SpacingSample({ token }: { token: string }) {
  const style: CSSProperties = {
    width: `var(${token})`,
    height: 20,
    backgroundColor: "var(--lifesg-primary-60)",
    borderRadius: 2,
  };
  return <div style={style} aria-hidden />;
}

export function RadiusSample({ token }: { token: string }) {
  const style: CSSProperties = {
    width: 80,
    height: 80,
    backgroundColor: "var(--lifesg-primary-90)",
    border: "1px solid var(--lifesg-primary-60)",
    borderRadius: `var(${token})`,
  };
  return <div style={style} aria-hidden />;
}

export function ShadowSample({ token }: { token: string }) {
  const style: CSSProperties = {
    width: 160,
    height: 80,
    backgroundColor: "white",
    borderRadius: 6,
    boxShadow: `var(${token})`,
  };
  return <div style={style} aria-hidden />;
}
