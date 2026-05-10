#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Colour, LifeSGTheme } = require("@lifesg/react-design-system/theme");

const lightProps = { theme: LifeSGTheme.light };
const darkProps = { theme: LifeSGTheme.dark };

const resolveAll = (group, props) =>
  Object.fromEntries(
    Object.entries(group).flatMap(([k, fn]) => {
      try {
        const v = fn(props);
        return typeof v === "string" ? [[k, v]] : [];
      } catch {
        return [];
      }
    })
  );

const primitives = resolveAll(Colour.Primitive, lightProps);

const semanticEntries = Object.entries(Colour).filter(([_, fn]) => typeof fn === "function");
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

const lines = [];
lines.push("/* Auto-generated from @lifesg/react-design-system — do not edit by hand. */");
lines.push("/* Run: npm run extract-tokens */");
lines.push("");
lines.push(":root {");
lines.push("  /* primitives */");
for (const [k, v] of Object.entries(primitives)) lines.push(`  --lifesg-${k}: ${v};`);
lines.push("");
lines.push("  /* semantic (light) */");
for (const [k, v] of Object.entries(semanticLight)) lines.push(`  --lifesg-${k}: ${v};`);
lines.push("}");
lines.push("");
lines.push(".dark {");
lines.push("  /* semantic (dark) */");
for (const [k, v] of Object.entries(semanticDark)) lines.push(`  --lifesg-${k}: ${v};`);
lines.push("}");
lines.push("");

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src/app/lifesg-tokens.css");
writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
console.log(`  primitives: ${Object.keys(primitives).length}`);
console.log(`  semantic (light): ${Object.keys(semanticLight).length}`);
console.log(`  semantic (dark): ${Object.keys(semanticDark).length}`);
