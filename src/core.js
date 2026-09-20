const WORD_RE = /[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu;

export function documentStats(text) {
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
  const words = text.match(WORD_RE)?.length ?? 0;
  const headings = text.match(/^#{1,6}\s+.+$/gm)?.length ?? 0;
  const links = text.match(/\[[^\]]+\]\([^\s)]+(?:\s+"[^"]*")?\)/g)?.length ?? 0;
  return { bytes: Buffer.byteLength(text, 'utf8'), characters: [...text].length, words, lines, headings, links };
}

export function normalizeText(text, { eol = 'lf', finalNewline = false } = {}) {
  if (!['lf', 'crlf'].includes(eol)) throw new Error('eol must be "lf" or "crlf"');
  let normalized = text.replace(/\r\n|\r/g, '\n');
  normalized = normalized.split('\n').map(line => line.replace(/[\t ]+$/g, '')).join('\n');
  normalized = normalized.replace(/\n{4,}/g, '\n\n\n').replace(/\n+$/g, '');
  if (finalNewline) normalized += '\n';
  return eol === 'crlf' ? normalized.replace(/\n/g, '\r\n') : normalized;
}

export function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function inlineMarkdown(raw) {
  let s = escapeHtml(raw);
  const code = [];
  s = s.replace(/`([^`]+)`/g, (_, v) => { code.push(`<code>${v}</code>`); return `\u0000${code.length - 1}\u0000`; });
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>').replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => code[Number(i)]);
}

export function markdownToHtml(markdown, { title = 'Document' } = {}) {
  const lines = markdown.replace(/\r\n|\r/g, '\n').split('\n');
  const out = [];
  let paragraph = [], list = null, fence = null;
  const flushParagraph = () => { if (paragraph.length) { out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`); paragraph = []; } };
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const line of lines) {
    if (fence !== null) {
      if (/^```/.test(line)) { out.push(`${escapeHtml(fence.join('\n'))}</code></pre>`); fence = null; }
      else fence.push(line);
      continue;
    }
    if (/^```/.test(line)) { flushParagraph(); flushList(); const lang = line.slice(3).trim().replace(/[^a-zA-Z0-9_-]/g, ''); out.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>`); fence = []; continue; }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) { flushParagraph(); flushList(); out.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`); continue; }
    const item = /^\s*([-*+] |\d+\. )(.+)$/.exec(line);
    if (item) { flushParagraph(); const type = /^\d/.test(item[1]) ? 'ol' : 'ul'; if (list !== type) { flushList(); out.push(`<${type}>`); list = type; } out.push(`<li>${inlineMarkdown(item[2])}</li>`); continue; }
    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) { flushParagraph(); flushList(); out.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`); continue; }
    if (!line.trim()) { flushParagraph(); flushList(); continue; }
    paragraph.push(line.trim());
  }
  if (fence !== null) throw new Error('Unclosed fenced code block');
  flushParagraph(); flushList();
  const safeTitle = escapeHtml(title);
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${safeTitle}</title>\n<style>body{max-width:800px;margin:40px auto;padding:0 20px;font:16px/1.6 system-ui,sans-serif;color:#1f2328}pre{overflow:auto;padding:16px;background:#f6f8fa;border-radius:6px}code{font-family:ui-monospace,monospace}blockquote{border-inline-start:4px solid #d0d7de;margin-inline-start:0;padding-inline-start:16px;color:#59636e}a{color:#0969da}</style>\n</head>\n<body>\n${out.join('\n')}\n</body>\n</html>\n`;
}
