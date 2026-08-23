export type ThemeMode = "system" | "light" | "dark";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
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

export type Settings = {
  theme: ThemeMode;
  searchEngineId: string;
  showQuote: boolean;
};

export type Persisted<T> = {
  version: number;
  data: T;
};