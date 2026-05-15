#!/usr/bin/env node
// Unified verification runner.
// Runs all smoke + measure + behavioral scripts in sequence, propagating exit codes.
// Usage: node scripts/verify-all.mjs
//        BASE=http://localhost:3000 node scripts/verify-all.mjs

import { execSync } from "node:child_process";

const base = process.env.BASE ?? "http://localhost:3000";

const suites = [
  // Smoke tests — do all panes mount without errors?
  { name: "smoke-content",             cmd: "node scripts/smoke-content.mjs" },
  { name: "smoke-navigation",          cmd: "node scripts/smoke-navigation.mjs" },
  { name: "smoke-form",                cmd: "node scripts/smoke-form.mjs" },
  { name: "smoke-overlays",            cmd: "node scripts/smoke-overlays.mjs" },
  { name: "smoke-selection-and-input",  cmd: "node scripts/smoke-selection-and-input.mjs" },

  // Measurement — do computed styles match between ours and LifeSG?
  { name: "measure-content",           cmd: "node scripts/measure-content.mjs" },
  { name: "measure-typography",        cmd: "node scripts/measure-typography.mjs" },

  // Behavioral — do keyboard interactions and ARIA states match?
  { name: "behavioral-content",        cmd: "node scripts/behavioral-content.mjs" },
];

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
let passed = 0;
let failed = 0;
const results = [];

console.log("=".repeat(70));
console.log("  VERIFY-ALL: Running all verification suites");
console.log(`  BASE: ${base}`);
console.log("=".repeat(70));
console.log("");

for (const suite of suites) {
  const label = pad(suite.name, 30);
  process.stdout.write(`  ${label} `);
  try {
    execSync(suite.cmd, {
      env: { ...process.env, BASE: base },
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120_000,
    });
    passed++;
    results.push({ name: suite.name, ok: true });
    console.log("✓ PASS");
  } catch (err) {
    failed++;
    results.push({ name: suite.name, ok: false, output: err.stdout?.toString().slice(-500) });
    console.log("✗ FAIL");
    // Print last few lines of output for context
    const tail = err.stdout?.toString().trim().split("\n").slice(-5).join("\n");
    if (tail) console.log(`    ${tail.replace(/\n/g, "\n    ")}`);
  }
}

console.log("");
console.log("=".repeat(70));
console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${suites.length} total`);
console.log("=".repeat(70));

process.exit(failed > 0 ? 1 : 0);
