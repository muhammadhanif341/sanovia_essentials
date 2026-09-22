#!/usr/bin/env node
/**
 * Contrast guard for the design system.
 *
 * Parses src/styles/tokens.css, resolves each [data-surface] block's semantic
 * tokens down to hex, and verifies the pairings components actually use against
 * WCAG 2.x. Exits 1 on any failure, so `npm run check` catches a palette edit
 * that silently breaks accessibility.
 *
 * No dependencies. Deliberately parses the CSS instead of duplicating the
 * palette in JS, so there is one source of truth.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, '..', 'src/styles/tokens.css'), 'utf8');

// ---- parse primitives (--name: #hex) --------------------------------------
const prim = {};
for (const m of css.matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) prim[m[1]] = m[2];

// ---- parse surface blocks -------------------------------------------------
const blocks = [...css.matchAll(/([^{}]*data-surface[^{}]*|:root\s*,[^{}]*)\{([^}]*)\}/g)];
const surfaces = {};
const declsOf = (body) => {
  const out = {};
  for (const d of body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  return out;
};
for (const [, selector, body] of blocks) {
  const names = [...selector.matchAll(/data-surface=['"]([a-z]+)['"]/g)].map((x) => x[1]);
  const decls = declsOf(body);
  for (const n of names) surfaces[n] = { ...(surfaces[n] ?? {}), ...decls };
}
// Later, more specific single-surface blocks (darker/raised/cream) inherit family values.
const family = { darker: 'dark', raised: 'dark', cream: 'ivory' };
for (const [child, parent] of Object.entries(family)) {
  surfaces[child] = { ...surfaces[parent], ...surfaces[child] };
}

const resolve = (value, surface) => {
  const v = value?.trim();
  if (!v) return null;
  if (v.startsWith('#')) return v;
  const ref = v.match(/^var\(--([a-z0-9-]+)\)$/);
  if (!ref) return null; // rgb()/alpha values are decorative, not contrast-checked
  const next = surfaces[surface]?.[ref[1]] ?? prim[ref[1]];
  return resolve(next, surface);
};

// ---- WCAG maths -----------------------------------------------------------
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// ---- the pairings components rely on --------------------------------------
// [foreground token, background token, minimum ratio, what it is]
const TEXT = 4.5;
const UI = 3;
const checks = [
  ['fg', 'surface', TEXT, 'body text'],
  ['fg-muted', 'surface', TEXT, 'muted text'],
  ['fg', 'surface-raised', TEXT, 'text on raised surface'],
  ['fg-muted', 'surface-raised', TEXT, 'muted text on raised surface'],
  ['accent', 'surface', TEXT, 'gold text / links / overlines'],
  ['accent', 'surface-raised', TEXT, 'gold text on raised surface'],
  ['accent-strong', 'surface', TEXT, 'gold hover text'],
  ['btn-fg', 'btn-bg', TEXT, 'primary button label'],
  ['btn-fg', 'btn-bg-hover', TEXT, 'primary button label (hover)'],
  ['surface', 'accent', TEXT, 'ghost button label on hover fill'],
  ['accent-ui', 'surface', UI, 'gold borders / icons (non-text 1.4.11)'],
  ['field-border', 'surface', UI, 'form field border (non-text 1.4.11)'],
  ['focus', 'surface', UI, 'focus ring (non-text 1.4.11 / 2.4.13)'],
  ['danger', 'surface', TEXT, 'error text'],
  ['success', 'surface', TEXT, 'success text'],
];

let failures = 0;
const rows = [];
for (const surface of Object.keys(surfaces)) {
  for (const [fgTok, bgTok, min, label] of checks) {
    const fg = resolve(surfaces[surface][fgTok], surface);
    const bg = resolve(surfaces[surface][bgTok], surface);
    if (!fg || !bg) {
      rows.push({ surface, label, r: null, min, ok: false, note: `unresolved --${fgTok} / --${bgTok}` });
      failures++;
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failures++;
    rows.push({ surface, label, r, min, ok, fg, bg });
  }
}

// Documented anti-patterns must stay failing — proves the guard can actually fail.
const antiPatterns = [
  ['champagne-400', 'ivory-50', 'logo-gold text on ivory'],
  ['ivory-50', 'champagne-400', 'ivory label on gold fill'],
];
let guardBroken = false;
for (const [a, b, label] of antiPatterns) {
  const r = ratio(prim[a], prim[b]);
  if (r >= TEXT) {
    guardBroken = true;
    console.error(`✗ anti-pattern "${label}" now PASSES (${r.toFixed(2)}) — the rule that forbids it is stale`);
  }
}

// ---- report ----------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
for (const surface of Object.keys(surfaces)) {
  console.log(`\n[${surface}]`);
  for (const row of rows.filter((x) => x.surface === surface)) {
    const score = row.r == null ? '  n/a' : row.r.toFixed(2).padStart(5);
    console.log(`  ${row.ok ? '✓' : '✗'} ${score}  (min ${row.min})  ${pad(row.label, 42)} ${row.note ?? ''}`);
  }
}
console.log(
  `\n${rows.length} pairings across ${Object.keys(surfaces).length} surfaces — ${
    failures ? `${failures} FAILED` : 'all pass'
  }`
);
if (failures || guardBroken) process.exit(1);
