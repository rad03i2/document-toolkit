import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url));
function run(args) { return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' }); }

test('stats emits machine-readable JSON', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'doc-toolkit-')); const input = join(dir, 'a.md'); await writeFile(input, '# Hi\nTwo words');
  const r = run(['stats', input, '--json']); assert.equal(r.status, 0); const value = JSON.parse(r.stdout); assert.equal(value.headings, 1); assert.equal(value.words, 4);
});

test('markdown-html writes output and protects it from overwrite', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'doc-toolkit-')); const input = join(dir, 'a.md'), output = join(dir, 'a.html'); await writeFile(input, '# Hi');
  assert.equal(run(['markdown-html', input, output]).status, 0); assert.match(await readFile(output, 'utf8'), /<h1>Hi<\/h1>/);
  const second = run(['markdown-html', input, output]); assert.equal(second.status, 2); assert.match(second.stderr, /EEXIST|exist/i);
  assert.equal(run(['markdown-html', input, output, '--overwrite']).status, 0);
});

test('refuses in-place output', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'doc-toolkit-')); const input = join(dir, 'a.txt'); await writeFile(input, 'x');
  const r = run(['normalize', input, input, '--overwrite']); assert.equal(r.status, 2); assert.match(r.stderr, /different/);
});
