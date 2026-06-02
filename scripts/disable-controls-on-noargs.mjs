#!/usr/bin/env node
// One-shot codemod: add `parameters: { controls: { disable: true } }`
// to every `export const X: Story = { … }` whose body contains
// `render: () =>` (no-args render). Merges into an existing
// top-level `parameters:` block if present.

import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: disable-controls-on-noargs.mjs <file1.stories.tsx> [...]");
  process.exit(1);
}

let totalTouched = 0;
let totalStories = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const { content, modified, touched } = transform(before);
  totalStories += touched;
  if (modified) {
    fs.writeFileSync(file, content);
    totalTouched += touched;
    console.log(`updated ${path.basename(file)} (${touched} stor${touched === 1 ? "y" : "ies"})`);
  }
}

console.log(`\ndone. ${totalTouched} story exports touched across ${files.length} files.`);

// ---------------------------------------------------------------------------

function transform(source) {
  const matches = [];
  const re = /^export const (\w+): (?:Story|StoryObj<[^>]+>) = \{$/gm;
  let m;
  while ((m = re.exec(source)) !== null) {
    matches.push({
      name: m[1],
      openBraceIdx: m.index + m[0].length - 1,
    });
  }
  for (const mm of matches) {
    mm.closeBraceIdx = findMatchingClose(source, mm.openBraceIdx);
  }

  let touched = 0;
  let result = source;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { openBraceIdx, closeBraceIdx } = matches[i];
    const body = result.slice(openBraceIdx + 1, closeBraceIdx);

    if (!/^ {2}render:\s*\(\s*\)\s*=>/m.test(body)) continue;
    if (/controls:\s*\{[^}]*disable:\s*true/.test(body)) continue;

    const newBody = injectControlsDisable(body);
    if (newBody !== body) {
      result =
        result.slice(0, openBraceIdx + 1) +
        newBody +
        result.slice(closeBraceIdx);
      touched++;
    }
  }
  return { content: result, modified: result !== source, touched };
}

function injectControlsDisable(body) {
  // Look for top-level `parameters:` key (2-space indent).
  const paramRe = /^( {2})parameters:\s*\{/m;
  const pm = paramRe.exec(body);

  if (!pm) {
    // No parameters key — prepend a fresh one as the first property.
    return `\n  parameters: { controls: { disable: true } },` + body;
  }

  const indent = pm[1];
  const innerIndent = indent + "  ";
  const paramOpenIdx = pm.index + pm[0].length - 1;
  const paramCloseIdx = findMatchingClose(body, paramOpenIdx);
  const paramBody = body.slice(paramOpenIdx + 1, paramCloseIdx);

  if (!paramBody.includes("\n")) {
    const trimmed = paramBody.trim();
    const replacement = `parameters: { controls: { disable: true }, ${trimmed} },`;
    // The line ends at the next `\n` after the closing `}`. We also strip
    // the existing trailing comma if there is one immediately after `}`.
    let endIdx = paramCloseIdx + 1;
    if (body[endIdx] === ",") endIdx++;
    return (
      body.slice(0, pm.index) +
      indent +
      replacement +
      body.slice(endIdx)
    );
  }

  // Multi-line parameters block — insert controls.disable as the first key.
  const insertion = `\n${innerIndent}controls: { disable: true },`;
  return (
    body.slice(0, paramOpenIdx + 1) +
    insertion +
    body.slice(paramOpenIdx + 1)
  );
}

// JS/TSX-aware brace matcher: respects strings, template literals (incl.
// ${ … } interpolation), line and block comments. Returns the index of
// the closing brace that matches the opener at `openIdx`.
function findMatchingClose(src, openIdx) {
  let depth = 1;
  let i = openIdx + 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === "{") {
      depth++;
      i++;
      continue;
    }
    if (c === "}") {
      depth--;
      if (depth === 0) return i;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      i = skipString(src, i, c);
      continue;
    }
    if (c === "`") {
      i = skipTemplate(src, i);
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length - 1 && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    i++;
  }
  return i;
}

function skipString(src, start, quote) {
  let i = start + 1;
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === quote) return i + 1;
    if (c === "\n") return i; // unterminated — bail
    i++;
  }
  return i;
}

function skipTemplate(src, start) {
  let i = start + 1;
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === "`") return i + 1;
    if (c === "$" && src[i + 1] === "{") {
      i += 2;
      let depth = 1;
      while (i < src.length && depth > 0) {
        if (src[i] === "{") depth++;
        else if (src[i] === "}") depth--;
        if (depth === 0) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    i++;
  }
  return i;
}
