import type { SearchEngine } from "../../types/domain";

export function buildSearchUrl(engine: SearchEngine, query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "";
  return engine.urlTemplate.replace("%s", encodeURIComponent(trimmed));
}

export function submitSearch(engine: SearchEngine, query: string): void {
  const url = buildSearchUrl(engine, query);
  if (url) {
    window.location.href = url;
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}