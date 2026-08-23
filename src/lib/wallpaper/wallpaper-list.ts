const wallpaperModules = import.meta.glob(
  "/wallpaper/*.{jpg,jpeg,png,webp,bmp}",
  { eager: true, query: "?url", import: "default" },
);

export function getWallpaperUrls(): string[] {
  return Object.values(wallpaperModules) as string[];
}