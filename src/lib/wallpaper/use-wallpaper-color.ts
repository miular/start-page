import { useEffect } from "react";
import type { ThemeMode } from "../../types/domain";
import { extractWallpaperColor, deriveGlassTokens } from "./color-extract";

const GLASS_KEY_LIST = [
  "--glass-bg",
  "--glass-bg-hover",
  "--glass-bg-active",
  "--glass-border",
  "--glass-highlight",
] as const;

function resolveIsDark(theme: ThemeMode): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function prefersReducedTransparency(): boolean {
  return window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
}

export function useWallpaperColor(url: string | null, theme: ThemeMode): void {
  useEffect(() => {
    if (!url || prefersReducedTransparency()) return;

    const wallpaperUrl: string = url;
    let cancelled = false;

    async function apply() {
      const color = await extractWallpaperColor(wallpaperUrl);
      if (cancelled || !color) return;

      const tokens = deriveGlassTokens(color, resolveIsDark(theme));
      for (const [key, value] of Object.entries(tokens)) {
        document.documentElement.style.setProperty(key, value);
      }
    }

    void apply();

    return () => {
      cancelled = true;
      for (const key of GLASS_KEY_LIST) {
        document.documentElement.style.removeProperty(key);
      }
    };
  }, [url, theme]);
}