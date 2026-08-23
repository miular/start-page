import type { Bookmark } from "../types/domain";

export const defaultBookmarks: Bookmark[] = [
  { id: "default-1", title: "GitHub", url: "https://github.com", order: 0 },
  { id: "default-2", title: "ChatGPT", url: "https://chatgpt.com", order: 1 },
  { id: "default-3", title: "Gemini", url: "https://gemini.google.com", order: 2 },
  { id: "default-4", title: "Markdown", url: "https://dillinger.io", order: 3 },
];