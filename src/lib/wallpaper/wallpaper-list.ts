const wallpaperModules = import.meta.glob(
  "/wallpaper/*.{jpg,jpeg,png,webp,bmp,mp4}",
  { eager: true, query: "?url", import: "default" },
);

export type WallpaperEntry = {
  url: string;
  isVideo: boolean;
};

export type WallpaperEntryWithPath = WallpaperEntry & {
  path: string;
};

export function getWallpaperEntries(): WallpaperEntry[] {
  return Object.entries(wallpaperModules).map(([path, url]) => ({
    url: url as string,
    isVideo: path.endsWith(".mp4"),
  }));
}

export function getWallpaperEntriesWithPath(): WallpaperEntryWithPath[] {
  return Object.entries(wallpaperModules).map(([path, url]) => ({
    path,
    url: url as string,
    isVideo: path.endsWith(".mp4"),
  }));
}

export function getWallpaperUrls(): string[] {
  return Object.values(wallpaperModules) as string[];
}