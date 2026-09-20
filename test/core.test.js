import test from 'node:test';
import assert from 'node:assert/strict';
import { documentStats, escapeHtml, markdownToHtml, normalizeText } from '../src/core.js';

test('documentStats handles Unicode words, headings and links', () => {
  const s = documentStats('# Hello\nمرحبا بالعالم\n[site](https://example.com)');
  assert.equal(s.lines, 3); assert.equal(s.headings, 1); assert.equal(s.links, 1); assert.equal(s.words, 5);
});

test('normalization trims trailing whitespace and controls blank lines', () => {
  assert.equal(normalizeText('a  \r\n\r\n\r\n\r\nb\t\r\n', { finalNewline: true }), 'a\n\n\nb\n');
  assert.equal(normalizeText('a\nb', { eol: 'crlf' }), 'a\r\nb');
});

test('escapeHtml escapes dangerous markup', () => assert.equal(escapeHtml('<script a="b">&'), '&lt;script a=&quot;b&quot;&gt;&amp;'));

test('Markdown renders supported structures and escapes raw HTML', () => {
  const html = markdownToHtml('# Title\n\n**bold** and [x](https://example.com)\n\n- one\n- two\n\n<script>x</script>', { title: '<T>' });
  assert.match(html, /<h1>Title<\/h1>/); assert.match(html, /<strong>bold<\/strong>/); assert.match(html, /<ul>/);
  assert.match(html, /&lt;script&gt;x&lt;\/script&gt;/); assert.doesNotMatch(html, /<script>x/); assert.match(html, /<title>&lt;T&gt;<\/title>/);
});

test('Markdown rejects an unclosed fence', () => assert.throws(() => markdownToHtml('```js\nconst x=1'), /Unclosed/));
