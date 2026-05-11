"use client";

import type { ReactNode } from "react";
import { Container, ColDiv, Content, Section } from "@/components/ui/layout";
import { Layout as LifeSGLayout } from "@lifesg/react-design-system/layout";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 py-3 border-b border-border last:border-0">
      <code className="text-xs text-muted-foreground" data-token={label}>{label}</code>
      <div className="w-full">{children}</div>
    </div>
  );
}

const cellCx = "rounded bg-[var(--lifesg-bg-strong)] p-2 text-xs text-center text-[var(--lifesg-text-subtle)]";

export function OursPane() {
  return (
    <div className="flex flex-col">
      <Row label='Container type="grid" (8/12 cols)'>
        <Container type="grid" className="bg-[var(--lifesg-bg-stronger)]/40 py-3">
          <ColDiv xxsCols={[1, -1]}><div className={cellCx}>span all (xxs)</div></ColDiv>
          <ColDiv xxsCols={4} lgCols={6}><div className={cellCx}>4/8 · 6/12</div></ColDiv>
          <ColDiv xxsCols={4} lgCols={6}><div className={cellCx}>4/8 · 6/12</div></ColDiv>
          <ColDiv xxsCols={[1, 5]} lgCols={[1, 5]}><div className={cellCx}>[1,5) — cols 1–4</div></ColDiv>
          <ColDiv xxsCols={[5, 9]} lgCols={[5, 13]}><div className={cellCx}>[5,9) · [5,13)</div></ColDiv>
        </Container>
      </Row>
      <Row label='Container type="flex" (default)'>
        <Container className="bg-[var(--lifesg-bg-stronger)]/40 py-3">
          <div className={cellCx + " grow"}>flex child A</div>
          <div className={cellCx + " grow"}>flex child B</div>
          <div className={cellCx + " grow"}>flex child C</div>
        </Container>
      </Row>
      <Row label="Section + Content (nested)">
        <Section>
          <Content type="grid" className="bg-[var(--lifesg-bg-stronger)]/40 py-3">
            <ColDiv xxsCols={[1, -1]}><div className={cellCx}>Content inside Section</div></ColDiv>
          </Content>
        </Section>
      </Row>
      <Row label="stretch (no max-width)">
        <Container type="grid" stretch className="bg-[var(--lifesg-bg-stronger)]/40 py-3">
          <ColDiv xxsCols={[1, -1]}><div className={cellCx}>stretches edge to edge</div></ColDiv>
        </Container>
      </Row>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col">
      <Row label='Layout.Container type="grid"'>
        <LifeSGLayout.Container type="grid" style={{ background: "rgba(237,239,239,0.4)", paddingBlock: 12 }}>
          <LifeSGLayout.ColDiv xxsCols={[1, -1]}><div className={cellCx}>span all (xxs)</div></LifeSGLayout.ColDiv>
          <LifeSGLayout.ColDiv xxsCols={4} lgCols={6}><div className={cellCx}>4/8 · 6/12</div></LifeSGLayout.ColDiv>
          <LifeSGLayout.ColDiv xxsCols={4} lgCols={6}><div className={cellCx}>4/8 · 6/12</div></LifeSGLayout.ColDiv>
          <LifeSGLayout.ColDiv xxsCols={[1, 5]} lgCols={[1, 5]}><div className={cellCx}>[1,5) — cols 1–4</div></LifeSGLayout.ColDiv>
          <LifeSGLayout.ColDiv xxsCols={[5, 9]} lgCols={[5, 13]}><div className={cellCx}>[5,9) · [5,13)</div></LifeSGLayout.ColDiv>
        </LifeSGLayout.Container>
      </Row>
      <Row label='Layout.Container type="flex" (default)'>
        <LifeSGLayout.Container style={{ background: "rgba(237,239,239,0.4)", paddingBlock: 12 }}>
          <div className={cellCx + " grow"}>flex child A</div>
          <div className={cellCx + " grow"}>flex child B</div>
          <div className={cellCx + " grow"}>flex child C</div>
        </LifeSGLayout.Container>
      </Row>
      <Row label="Layout.Section + Layout.Content">
        <LifeSGLayout.Section>
          <LifeSGLayout.Content type="grid" style={{ background: "rgba(237,239,239,0.4)", paddingBlock: 12 }}>
            <LifeSGLayout.ColDiv xxsCols={[1, -1]}><div className={cellCx}>Content inside Section</div></LifeSGLayout.ColDiv>
          </LifeSGLayout.Content>
        </LifeSGLayout.Section>
      </Row>
      <Row label="stretch">
        <LifeSGLayout.Container type="grid" stretch style={{ background: "rgba(237,239,239,0.4)", paddingBlock: 12 }}>
          <LifeSGLayout.ColDiv xxsCols={[1, -1]}><div className={cellCx}>stretches edge to edge</div></LifeSGLayout.ColDiv>
        </LifeSGLayout.Container>
      </Row>
    </div>
  );
}
