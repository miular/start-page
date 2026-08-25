import { useState, useCallback } from "react";
import { MarkdownPane } from "./MarkdownPane";
import { exportMarkdown, exportMarkdownAsHtml, exportMarkdownAsPdf } from "./markdown-export";
import { Button } from "../../ui/button";
import { Icon } from "../../ui/icon";

const defaultMarkdown = `# 欢迎使用 Markdown 编辑器

## 实时预览

输入 **Markdown** 文本，右侧实时渲染。

### 支持特性

- 标题 / 段落 / 列表
- **粗体**、*斜体*、~~删除线~~
- \`行内代码\` 和代码块
- [链接](https://example.com)
- 表格、任务列表

\`\`\`js
const hello = "World";
console.log(hello);
\`\`\`

| 功能 | 状态 |
|------|------|
| 代码块 | ✅ |
| 表格 | ✅ |
`;

export function Workspace() {
  const [markdownValue, setMarkdownValue] = useState(defaultMarkdown);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportMd = useCallback(async () => {
    setShowExportMenu(false);
    await exportMarkdown(markdownValue);
  }, [markdownValue]);

  const handleExportHtml = useCallback(async () => {
    setShowExportMenu(false);
    await exportMarkdownAsHtml(markdownValue);
  }, [markdownValue]);

  const handleExportPdf = useCallback(async () => {
    setShowExportMenu(false);
    await exportMarkdownAsPdf(markdownValue);
  }, [markdownValue]);

  return (
    <div className="workspace-container glass-container">
      <div className="workspace-toolbar">
        <div className="workspace-export-wrapper">
          <Button
            variant="ghost"
            className="workspace-export-btn"
            onClick={() => setShowExportMenu((v) => !v)}
            onBlur={() => setTimeout(() => setShowExportMenu(false), 150)}
            aria-label="Export markdown"
          >
            <Icon name="fileDown" size={16} />
            <span>Export</span>
          </Button>
          {showExportMenu && (
            <div className="workspace-export-menu">
              <button type="button" className="workspace-export-menu-item" onClick={handleExportMd}>
                <Icon name="download" size={14} />
                <span>Export as .md</span>
              </button>
              <button type="button" className="workspace-export-menu-item" onClick={handleExportHtml}>
                <Icon name="download" size={14} />
                <span>Export as .html</span>
              </button>
              <button type="button" className="workspace-export-menu-item" onClick={handleExportPdf}>
                <Icon name="download" size={14} />
                <span>Export as .pdf (Print)</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="workspace-pane">
        <MarkdownPane value={markdownValue} onChange={setMarkdownValue} />
      </div>
    </div>
  );
}