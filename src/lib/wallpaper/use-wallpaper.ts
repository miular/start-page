import { useState, useEffect } from "react";
import { getWallpaperUrls } from "./wallpaper-list";

export function useRandomWallpaper(): string | null {
  const [wallpaper, setWallpaper] = useState<string | null>(null);

  useEffect(() => {
    const urls = getWallpaperUrls();
    if (urls.length === 0) return;

    const randomIndex = Math.floor(Math.random() * urls.length);
    const url = urls[randomIndex];

    const img = new Image();
    img.onload = () => setWallpaper(url);
    img.onerror = () => setWallpaper(null);
    img.src = url;
  }, []);

  return wallpaper;
}