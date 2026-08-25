import type { Bookmark } from "../types/domain";

export const defaultBookmarks: Bookmark[] = [
  // 工具
  { id: "default-1", title: "GitHub", url: "https://github.com", categoryId: "cat-tools", order: 0 },
  { id: "default-4", title: "Markdown", url: "https://stackedit.io/app#", categoryId: "cat-tools", order: 1 },
  { id: "default-5", title: "VSCode", url: "https://vscode.dev", categoryId: "cat-tools", order: 2 },
  { id: "default-7", title: "壁纸", url: "https://haowallpaper.com/homeView", categoryId: "cat-tools", order: 3 },
  { id: "default-8", title: "Z-Library", url: "https://zh.ztianjing.ru/", categoryId: "cat-tools", order: 4 },
  // 大模型
  { id: "default-2", title: "ChatGPT", url: "https://chatgpt.com", categoryId: "cat-llm", order: 0 },
  { id: "default-3", title: "Gemini", url: "https://gemini.google.com", categoryId: "cat-llm", order: 1 },
  { id: "default-6", title: "Claude", url: "https://claude.ai", categoryId: "cat-llm", order: 2 },
  { id: "default-9", title: "DeepSeek", url: "https://chat.deepseek.com", categoryId: "cat-llm", order: 3 },
  { id: "default-10", title: "Kimi", url: "https://kimi.moonshot.cn", categoryId: "cat-llm", order: 4 },
  { id: "default-11", title: "千问", url: "https://tongyi.aliyun.com", categoryId: "cat-llm", order: 5 },
  { id: "default-12", title: "豆包", url: "https://www.doubao.com", categoryId: "cat-llm", order: 6 },
];