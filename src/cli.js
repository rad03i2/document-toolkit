#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { TextDecoder } from 'node:util';
import { documentStats, markdownToHtml, normalizeText } from './core.js';

const VERSION = '1.0.0';
const HELP = `Document Toolkit ${VERSION}\n\nUsage:\n  doc-toolkit stats <input> [--json]\n  doc-toolkit normalize <input> <output> [--eol lf|crlf] [--final-newline] [--overwrite]\n  doc-toolkit markdown-html <input> <output> [--title <title>] [--overwrite]\n  doc-toolkit --version | --help`;

function option(args, name, fallback) { const i = args.indexOf(name); if (i < 0) return fallback; if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${name} requires a value`); return args[i + 1]; }
function has(args, name) { return args.includes(name); }
async function readUtf8(path) { const data = await readFile(path); return new TextDecoder('utf-8', { fatal: true }).decode(data); }
async function safeWrite(input, output, content, overwrite) {
  if (resolve(input) === resolve(output)) throw new Error('Input and output paths must be different');
  await writeFile(output, content, { encoding: 'utf8', flag: overwrite ? 'w' : 'wx' });
}
function assertArgs(args, count, command) { if (args.length < count) throw new Error(`Missing argument(s) for ${command}`); }

async function main(argv) {
  if (!argv.length || has(argv, '--help')) { console.log(HELP); return; }
  if (has(argv, '--version')) { console.log(VERSION); return; }
  const [command, ...args] = argv;
  if (command === 'stats') {
    assertArgs(args, 1, command); const text = await readUtf8(args[0]); const stats = documentStats(text);
    if (has(args, '--json')) console.log(JSON.stringify({ file: args[0], ...stats }, null, 2));
    else for (const [key, value] of Object.entries(stats)) console.log(`${key.padEnd(12)} ${value}`);
    return;
  }
  if (command === 'normalize') {
    assertArgs(args, 2, command); const [input, output] = args; const text = await readUtf8(input);
    const result = normalizeText(text, { eol: option(args, '--eol', 'lf'), finalNewline: has(args, '--final-newline') });
    await safeWrite(input, output, result, has(args, '--overwrite')); console.log(`Wrote ${output}`); return;
  }
  if (command === 'markdown-html') {
    assertArgs(args, 2, command); const [input, output] = args; const text = await readUtf8(input);
    const result = markdownToHtml(text, { title: option(args, '--title', input) });
    await safeWrite(input, output, result, has(args, '--overwrite')); console.log(`Wrote ${output}`); return;
  }
  throw new Error(`Unknown command: ${command}`);
}

main(process.argv.slice(2)).catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 2; });
