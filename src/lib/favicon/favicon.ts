export function getFaviconUrl(url: string, _title?: string): string {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return "";
  }
}

export function getInitials(title: string): string {
  return title.slice(0, 2).toUpperCase();
}

export function getFaviconFallbackChain(url: string, _title: string): string[] {
  const explicit = getFaviconUrl(url);
  if (explicit) return [explicit];
  return [];
}