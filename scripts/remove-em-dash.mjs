#!/usr/bin/env node
// Scans the repo and replaces Em Dash (U+2014) characters with a plain-text
// equivalent that keeps prose readable and preserves UI placeholder usage.
//
// Usage:
//   node scripts/remove-em-dash.mjs           # dry run, lists files + counts
//   node scripts/remove-em-dash.mjs --write   # applies changes

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const EM_DASH = "\u2014";
const EXTENSIONS = new Set([
  ".html",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".php",
  ".md",
  ".json",
  ".css",
]);

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".vite",
  ".output",
  "attached_assets",
  ".local",
  ".cache",
  ".agents",
]);

function listCandidateFiles(root = process.cwd()) {
  const results = [];
  const stack = [root];

  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name)) continue;
        stack.push(path.join(dir, entry.name));
      } else if (entry.isFile()) {
        if (EXTENSIONS.has(path.extname(entry.name))) {
          results.push(path.relative(process.cwd(), path.join(dir, entry.name)));
        }
      }
    }
  }
  return results;
}

// A standalone quoted placeholder value like "—" (used as an empty/no-data
// indicator in tables and metrics) keeps its function as a dash-like glyph
// but becomes a plain ASCII hyphen instead of being deleted or spaced out.
const PLACEHOLDER_RE = /(["'`])\u2014\1/g;

// Any other Em Dash, optionally surrounded by whitespace, is replaced with a
// single space so the surrounding text merges naturally. A leading dash used
// as a bullet marker at the start of a line is simply dropped.
const BULLET_RE = /^(\s*)\u2014\s*/gm;
const GENERAL_RE = /\s*\u2014\s*/g;

function transform(content) {
  let changed = content;
  changed = changed.replace(PLACEHOLDER_RE, (_m, quote) => `${quote}-${quote}`);
  changed = changed.replace(BULLET_RE, (_m, indent) => `${indent}`);
  changed = changed.replace(GENERAL_RE, " ");
  return changed;
}

function main() {
  const write = process.argv.includes("--write");
  const files = listCandidateFiles();
  const results = [];

  for (const file of files) {
    let content;
    try {
      if (statSync(file).isDirectory()) continue;
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (!content.includes(EM_DASH)) continue;

    const count = (content.match(/\u2014/g) || []).length;
    const updated = transform(content);
    if (updated !== content) {
      results.push({ file, count });
      if (write) writeFileSync(file, updated, "utf8");
    }
  }

  if (results.length === 0) {
    console.log("No Em Dash characters found.");
    return;
  }

  console.log(`${write ? "Modified" : "Would modify"} ${results.length} file(s):`);
  for (const { file, count } of results) {
    console.log(`  ${file}  (${count} occurrence${count === 1 ? "" : "s"})`);
  }
  if (!write) {
    console.log("\nRun with --write to apply changes.");
  }
}

main();
