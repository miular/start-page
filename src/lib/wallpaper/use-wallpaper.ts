import { useState, useEffect, useRef } from "react";
import { getWallpaperEntries, getWallpaperEntriesWithPath } from "./wallpaper-list";

export type WallpaperInfo = {
  url: string;
  isVideo: boolean;
};

function pickRandom(): WallpaperInfo | null {
  const entries = getWallpaperEntries();
  if (entries.length === 0) return null;
  return entries[Math.floor(Math.random() * entries.length)];
}

export function useWallpaper(selectedPath: string | null, customUrl?: string | null): WallpaperInfo | null {
  const [wallpaper, setWallpaper] = useState<WallpaperInfo | null>(null);
  const prevKey = useRef<string | null>(null);

  useEffect(() => {
    const key = customUrl ?? selectedPath ?? "__random__";
    if (key === prevKey.current) return;
    prevKey.current = key;

    if (customUrl) {
      const img = new Image();
      const entry: WallpaperInfo = { url: customUrl, isVideo: false };
      img.onload = () => setWallpaper(entry);
      img.onerror = () => setWallpaper(null);
      img.src = customUrl;
      return;
    }

    let entry: WallpaperInfo | null = null;

    if (selectedPath) {
      const all = getWallpaperEntriesWithPath();
      entry = all.find((e) => e.path === selectedPath) ?? null;
    }

    if (!entry) {
      entry = pickRandom();
    }

    if (!entry) return;

    if (entry.isVideo) {
      setWallpaper(entry);
    } else {
      const img = new Image();
      img.onload = () => setWallpaper(entry);
      img.onerror = () => setWallpaper(null);
      img.src = entry.url;
    }
  }, [selectedPath, customUrl]);

  return wallpaper;
}