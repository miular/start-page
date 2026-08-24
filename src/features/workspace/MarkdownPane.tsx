import { useCallback, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, ViewPlugin, Decoration, ViewUpdate } from "@codemirror/view";
import type { DecorationSet } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { setMarkdownDoc } from "../../lib/terminal/session";

const transparentTheme = EditorView.theme({
  "&": { background: "transparent", backgroundColor: "transparent", color: "var(--color-text-primary)", height: "100%" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "var(--font-sans)", background: "transparent" },
  ".cm-content": { caretColor: "var(--color-text-primary)" },
  ".cm-gutters": { background: "transparent", borderRight: "1px solid var(--glass-border)", color: "var(--color-text-tertiary)" },
  ".cm-activeLine": { background: "var(--glass-bg)" },
  ".cm-activeLineGutter": { background: "transparent" },
  ".cm-selectionBackground": { background: "var(--color-focus) !important", opacity: 0.3 },
  "&.cm-focused .cm-selectionBackground": { background: "var(--color-focus) !important", opacity: 0.3 },
  ".cm-cursor": { borderLeftColor: "var(--color-text-primary)" },
});

const markdownInlineStyles = HighlightStyle.define([
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.monospace, fontFamily: "var(--font-mono)", background: "var(--glass-bg)", borderRadius: "3px", padding: "0 4px" },
  { tag: tags.link, color: "var(--color-accent)", textDecoration: "underline" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
]);

const headingDecorationPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.build(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.build(update.view);
    }
  }

  build(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>();
    for (let pos = 0; pos < view.state.doc.length;) {
      const line = view.state.doc.lineAt(pos);
      const match = line.text.match(/^(#{1,6})\s/);
      if (match) {
        const level = match[1].length;
        builder.add(line.from, line.from, Decoration.line({ class: `md-h${level}` }));
      }
      pos = line.to + 1;
    }
    return builder.finish();
  }
}, { decorations: (v) => v.decorations });

type MarkdownPaneProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownPane({ value, onChange }: MarkdownPaneProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMarkdownDoc(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const editorEl = editorRef.current;
    const previewEl = previewRef.current;
    if (!editorEl || !previewEl) return;

    let rafId: number;

    const attach = () => {
      const editorScroller = editorEl.querySelector(".cm-scroller") as HTMLElement | null;
      if (!editorScroller) {
        rafId = requestAnimationFrame(attach);
        return;
      }

      const onEditorScroll = () => {
        if (syncingRef.current === "preview") return;
        syncingRef.current = "editor";
        const maxScroll = editorScroller.scrollHeight - editorScroller.clientHeight;
        if (maxScroll > 0) {
          const ratio = editorScroller.scrollTop / maxScroll;
          previewEl.scrollTop = ratio * (previewEl.scrollHeight - previewEl.clientHeight);
        }
        requestAnimationFrame(() => {
          syncingRef.current = null;
        });
      };

      const onPreviewScroll = () => {
        if (syncingRef.current === "editor") return;
        syncingRef.current = "preview";
        const maxScroll = previewEl.scrollHeight - previewEl.clientHeight;
        if (maxScroll > 0) {
          const ratio = previewEl.scrollTop / maxScroll;
          editorScroller.scrollTop = ratio * (editorScroller.scrollHeight - editorScroller.clientHeight);
        }
        requestAnimationFrame(() => {
          syncingRef.current = null;
        });
      };

      editorScroller.addEventListener("scroll", onEditorScroll);
      previewEl.addEventListener("scroll", onPreviewScroll);

      cleanupRef.current = () => {
        editorScroller.removeEventListener("scroll", onEditorScroll);
        previewEl.removeEventListener("scroll", onPreviewScroll);
      };
    };

    attach();
    return () => {
      cancelAnimationFrame(rafId);
      cleanupRef.current?.();
    };
  }, []);

  const handleChange = useCallback((val: string) => {
    onChange(val);
  }, [onChange]);

  return (
    <div className="markdown-pane">
      <div className="markdown-editor" ref={editorRef}>
        <CodeMirror
          className="markdown-codemirror"
          value={value}
          onChange={handleChange}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            oneDark,
            transparentTheme,
            syntaxHighlighting(markdownInlineStyles),
            headingDecorationPlugin,
          ]}
          height="100%"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
          }}
        />
      </div>
      <div className="markdown-preview" ref={previewRef}>
        <div className="markdown-preview-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}