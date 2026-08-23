import type { SearchEngine } from "../types/domain";

export const searchEngines: SearchEngine[] = [
  { id: "google", name: "Google", urlTemplate: "https://www.google.com/search?q=%s" },
  { id: "bing", name: "Bing", urlTemplate: "https://www.bing.com/search?q=%s" },
  { id: "duckduckgo", name: "DuckDuckGo", urlTemplate: "https://duckduckgo.com/?q=%s" },
  { id: "baidu", name: "Baidu", urlTemplate: "https://www.baidu.com/s?wd=%s" },
];