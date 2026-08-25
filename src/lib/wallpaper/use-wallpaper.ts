import { useState, useEffect, useRef, useCallback } from "react";
import { getWallpaperEntries, getWallpaperEntriesWithPath } from "./wallpaper-list";
import { getWallpaperBlob } from "./image-store";
import type { WallpaperSource } from "../../types/domain";

export type WallpaperInfo = {
  url: string;
  isVideo: boolean;
  kind?: "preset" | "upload";
};

function pickRandom(): WallpaperInfo | null {
  const entries = getWallpaperEntries();
  if (entries.length === 0) return null;
  return entries[Math.floor(Math.random() * entries.length)];
}

export function useWallpaper(source: WallpaperSource | null): WallpaperInfo | null {
  const [wallpaper, setWallpaper] = useState<WallpaperInfo | null>(null);
  const prevKey = useRef<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    const key = source ? `${source.kind}:${source.kind === "preset" ? source.path : source.id}` : "__random__";
    if (key === prevKey.current) return;
    prevKey.current = key;

    revokeObjectUrl();

    if (!source) {
      setWallpaper(pickRandom());
      return;
    }

    if (source.kind === "preset") {
      const all = getWallpaperEntriesWithPath();
      const entry = all.find((e) => e.path === source.path) ?? null;
      if (!entry) {
        setWallpaper(pickRandom());
        return;
      }
      if (entry.isVideo) {
        setWallpaper({ url: entry.url, isVideo: true, kind: "preset" });
      } else {
        const img = new Image();
        img.onload = () => setWallpaper({ url: entry.url, isVideo: false, kind: "preset" });
        img.onerror = () => setWallpaper(null);
        img.src = entry.url;
      }
      return;
    }

    getWallpaperBlob(source.id).then((blob) => {
      if (!blob) {
        setWallpaper(pickRandom());
        return;
      }
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      const img = new Image();
      img.onload = () => setWallpaper({ url, isVideo: false, kind: "upload" });
      img.onerror = () => {
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;
        setWallpaper(pickRandom());
      };
      img.src = url;
    });
  }, [source, revokeObjectUrl]);

  useEffect(() => {
    return () => revokeObjectUrl();
  }, [revokeObjectUrl]);

  return wallpaper;
}