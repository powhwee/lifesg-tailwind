#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  Colour,
  Font,
  Motion,
  Border,
  Spacing,
  Radius,
  Shadow,
  Breakpoint,
  LifeSGTheme,
} = require("@lifesg/react-design-system/theme");

const lightProps = { theme: LifeSGTheme.light };
const darkProps = { theme: LifeSGTheme.dark };

/* Resolve every `(props) => string` entry in a token group to a flat map. Skips
 * entries that throw, return non-strings, or that are non-function (e.g. Font.Spec,
 * Border.Util — namespaced sub-groups handled separately). */
const resolveStringGroup = (group, props) =>
  Object.fromEntries(
    Object.entries(group).flatMap(([k, fn]) => {
      if (typeof fn !== "function") return [];
      try {
        const v = fn(props);
        return typeof v === "string" ? [[k, v]] : [];
      } catch {
        return [];
      }
    })
  );

/* Breakpoint values are raw numbers. *-column entries are unitless counts; the rest
 * are pixel measurements. We stringify with `px` so the vars are drop-in for media
 * queries and Tailwind's @theme. */
const resolveBreakpoints = (group, props) =>
  Object.fromEntries(
    Object.entries(group).flatMap(([k, fn]) => {
      if (typeof fn !== "function") return [];
      try {
        const v = fn(props);
        if (typeof v !== "number") return [];
        return [[k, k.endsWith("-column") ? `${v}` : `${v}px`]];
      } catch {
        return [];
      }
    })
  );

const primitives = resolveStringGroup(Colour.Primitive, lightProps);
const semanticEntries = Object.entries(Colour).filter(([, fn]) => typeof fn === "function");
const semanticLight = Object.fromEntries(
  semanticEntries.flatMap(([k, fn]) => {
    try { const v = fn(lightProps); return typeof v === "string" ? [[k, v]] : []; } catch { return []; }
  })
);
const semanticDark = Object.fromEntries(
  semanticEntries.flatMap(([k, fn]) => {
    try { const v = fn(darkProps); return typeof v === "string" ? [[k, v]] : []; } catch { return []; }
  })
);

const fontSpec = resolveStringGroup(Font.Spec, lightProps);
const motion = resolveStringGroup(Motion, lightProps);
const border = resolveStringGroup(Border, lightProps);
const spacing = resolveStringGroup(Spacing, lightProps);
const radius = resolveStringGroup(Radius, lightProps);
const shadow = resolveStringGroup(Shadow, lightProps);
const breakpoint = resolveBreakpoints(Breakpoint, lightProps);

const lines = [];
const push = (s = "") => lines.push(s);
const section = (heading, prefix, entries) => {
  push(`  /* ${heading} */`);
  for (const [k, v] of Object.entries(entries)) {
    /* Strip a duplicated leading `font-` so `Font.Spec`'s `font-family` key under
     * the `font-` prefix becomes `--lifesg-font-family`, not `--lifesg-font-font-family`. */
    const key = prefix && k.startsWith(prefix) ? k.slice(prefix.length) : k;
    push(`  --lifesg-${prefix}${key}: ${v};`);
  }
  push("");
};

push("/* Auto-generated from @lifesg/react-design-system — do not edit by hand. */");
push("/* Run: npm run extract-tokens */");
push("");
push(":root {");
section("colour primitives", "", primitives);
section("colour semantic (light)", "", semanticLight);
section("font", "font-", fontSpec);
section("spacing", "", spacing);
section("radius", "radius-", radius);
section("border (widths + style)", "border-", border);
section("motion", "motion-", motion);
section("shadow", "shadow-", shadow);
section("breakpoint", "breakpoint-", breakpoint);
push("}");
push("");
push(".dark {");
section("colour semantic (dark)", "", semanticDark);
push("}");
push("");

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src/app/lifesg-tokens.css");
writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
console.log(`  colour primitives:   ${Object.keys(primitives).length}`);
console.log(`  colour semantic L/D: ${Object.keys(semanticLight).length} / ${Object.keys(semanticDark).length}`);
console.log(`  font (Spec):         ${Object.keys(fontSpec).length}`);
console.log(`  spacing:             ${Object.keys(spacing).length}`);
console.log(`  radius:              ${Object.keys(radius).length}`);
console.log(`  border:              ${Object.keys(border).length}`);
console.log(`  motion:              ${Object.keys(motion).length}`);
console.log(`  shadow:              ${Object.keys(shadow).length}`);
console.log(`  breakpoint:          ${Object.keys(breakpoint).length}`);
