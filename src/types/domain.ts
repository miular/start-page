export type ThemeMode = "system" | "light" | "dark";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  categoryId?: string;
  order: number;
  lastUsedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  order: number;
};

export type SearchEngine = {
  id: string;
  name: string;
  urlTemplate: string;
};

export type Quote = {
  id: string;
  text: string;
  author?: string;
  source?: string;
};

export type WallpaperSource =
  | { kind: "preset"; path: string }
  | { kind: "upload"; id: string };

export type Settings = {
  theme: ThemeMode;
  searchEngineId: string;
  showQuote: boolean;
};

export type Persisted<T> = {
  version: number;
  data: T;
};