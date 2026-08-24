type FilePickerAcceptType = {
  description?: string;
  accept: Record<string, string[]>;
};

function deriveFilename(value: string, ext: string): string {
  const match = value.match(/^#\s+(.+)/m);
  const name = match
    ? match[1].trim().replace(/[/\\?%*:|"<>]/g, "_")
    : `note-${new Date().toISOString().slice(0, 16).replace("T", "-")}`;
  return `${name}.${ext}`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(value: string): string {
  const lines = value.split("\n");
  const html: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];

  function flushCodeBlock() {
    if (codeBuffer.length > 0) {
      html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
      codeBuffer = [];
    }
  }

  function flushTable() {
    if (tableBuffer.length > 0) {
      const rows = tableBuffer.map((row, idx) => {
        const cells = row.split("|").filter((c) => c.trim() !== "");
        if (idx === 1 && /^[\s:-]+$/.test(cells.join(""))) return null;
        const tag = idx === 0 ? "th" : "td";
        return `<tr>${cells.map((c) => `<${tag}>${renderInline(escapeHtml(c.trim()))}</${tag}>`).join("")}</tr>`;
      }).filter(Boolean).join("\n");
      html.push(`<table>${rows}</table>`);
      tableBuffer = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith("|")) {
      if (!inTable) {
        flushTable();
        inTable = true;
        tableBuffer = [];
      }
      tableBuffer.push(line);
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    const trimmed = line.trim();

    if (trimmed === "") {
      html.push("");
      continue;
    }

    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      html.push("<hr>");
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(escapeHtml(headingMatch[2]))}</h${level}>`);
      continue;
    }

    const blockquoteMatch = trimmed.match(/^>\s?(.*)/);
    if (blockquoteMatch) {
      html.push(`<blockquote>${renderInline(escapeHtml(blockquoteMatch[1]))}</blockquote>`);
      continue;
    }

    const ulMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (ulMatch) {
      html.push(`<li>${renderInline(escapeHtml(ulMatch[1]))}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      html.push(`<li>${renderInline(escapeHtml(olMatch[1]))}</li>`);
      continue;
    }

    html.push(`<p>${renderInline(escapeHtml(trimmed))}</p>`);
  }

  flushCodeBlock();
  flushTable();

  return html.join("\n");
}

function getPrintHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { margin: 2cm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #1a1a1a;
    max-width: 70ch;
    margin: 0 auto;
    padding: 0;
  }
  h1 { font-size: 1.75rem; margin-top: 1.5em; margin-bottom: 0.5em; }
  h2 { font-size: 1.4rem; margin-top: 1.5em; margin-bottom: 0.5em; }
  h3 { font-size: 1.15rem; margin-top: 1.5em; margin-bottom: 0.5em; }
  h4, h5, h6 { font-size: 1rem; margin-top: 1.2em; margin-bottom: 0.5em; }
  p { margin-bottom: 1em; }
  ul, ol { margin-bottom: 1em; padding-left: 1.5em; }
  li { margin-bottom: 0.25em; }
  li + li { margin-top: 0.25em; }
  code {
    font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
    font-size: 0.9em;
    background: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  pre {
    background: #f5f5f5;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 1em;
  }
  pre code { background: none; padding: 0; font-size: 0.85em; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; }
  blockquote {
    border-left: 3px solid #888;
    padding-left: 1em;
    color: #555;
    margin-bottom: 1em;
  }
  a { color: #2563eb; }
  hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
  img { max-width: 100%; }
  @media print {
    a { color: inherit; text-decoration: underline; }
  }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

async function saveFile(blob: Blob, suggestedName: string, fileTypes: FilePickerAcceptType[]): Promise<void> {
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName,
        types: fileTypes,
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      /* user cancelled — do nothing */
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      /* API unavailable — fall through to Blob download */
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportMarkdown(value: string): Promise<void> {
  const filename = deriveFilename(value, "md");
  const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
  await saveFile(blob, filename, [
    { description: "Markdown", accept: { "text/markdown": [".md"] } },
  ]);
}

export async function exportMarkdownAsHtml(value: string): Promise<void> {
  const filename = deriveFilename(value, "html");
  const bodyHtml = mdToHtml(value);
  const fullHtml = getPrintHtml(filename, bodyHtml);
  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  await saveFile(blob, filename, [
    { description: "HTML", accept: { "text/html": [".html"] } },
  ]);
}

export async function exportMarkdownAsPdf(value: string): Promise<void> {
  const filename = deriveFilename(value, "pdf");
  const bodyHtml = mdToHtml(value);
  const printHtml = getPrintHtml(filename, bodyHtml);

  const win = window.open("", "_blank");
  if (!win) {
    /* popup blocked — fallback: download as .html and let user print */
    const blob = new Blob([printHtml], { type: "text/html;charset=utf-8" });
    await saveFile(blob, filename.replace(/\.pdf$/, ".html"), [
      { description: "HTML", accept: { "text/html": [".html"] } },
    ]);
    return;
  }
  win.document.write(printHtml);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}