import { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Clock } from "../features/clock";
import { Quote } from "../features/quote";
import { SearchBar } from "../features/search";
import { Workspace } from "../features/workspace";
import { RecentBookmarks } from "../features/recent";
import { Sidebar } from "../features/sidebar";
import { SettingsDialog } from "../features/settings";
import { GlassIcon } from "../ui/glass";
import { Icon } from "../ui/icon";
import { storage } from "../lib/storage";
import { useWallpaper, useWallpaperColor } from "../lib/wallpaper";
import { listWallpaperImages, saveWallpaperImage, deleteWallpaperImage } from "../lib/wallpaper/image-store";
import type { UploadedWallpaperMeta } from "../lib/wallpaper/image-store";
import { defaultBookmarks } from "../data/default-bookmarks";
import { defaultCategories } from "../data/default-categories";
import { searchEngines } from "../data/search-engines";
import type { Bookmark, Category, Settings, WallpaperSource } from "../types/domain";

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  searchEngineId: "google",
  showQuote: true,
};

const WALLPAPER_KEY = "selected-wallpaper";

function loadSettings(): Settings {
  const stored = storage.get<Settings>("settings");
  return stored ?? DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings): void {
  storage.set("settings", settings);
}

function loadWallpaperSource(): WallpaperSource | null {
  const stored = storage.get<unknown>(WALLPAPER_KEY);
  if (stored === null) return null;
  if (typeof stored === "string") {
    return { kind: "preset", path: stored };
  }
  if (typeof stored === "object" && stored !== null && "kind" in (stored as Record<string, unknown>)) {
    return stored as WallpaperSource;
  }
  return null;
}

function saveWallpaperSource(source: WallpaperSource | null): void {
  if (source) {
    storage.set(WALLPAPER_KEY, source);
  } else {
    storage.remove(WALLPAPER_KEY);
  }
}

function loadCategories(): Category[] {
  const stored = storage.get<Category[]>("categories");
  if (stored && stored.length > 0) {
    const existingIds = new Set(stored.map((c) => c.id));
    const merged = [...stored];
    for (const dc of defaultCategories) {
      if (!existingIds.has(dc.id)) {
        merged.push({ ...dc });
      }
    }
    if (merged.length !== stored.length) {
      storage.set("categories", merged);
    }
    return merged;
  }
  const copy = defaultCategories.map((c) => ({ ...c }));
  storage.set("categories", copy);
  return copy;
}

function saveCategories(categories: Category[]): void {
  storage.set("categories", categories);
}

function loadBookmarks(): Bookmark[] {
  const stored = storage.get<Bookmark[]>("bookmarks");
  if (stored && stored.length > 0) {
    let needsSave = false;
    const migrated = stored.map((b) => {
      const old = b as Record<string, unknown>;
      if (old.category && !b.categoryId) {
        needsSave = true;
        return { ...b, categoryId: old.category as string, category: undefined };
      }
      return b;
    });
    const existingIds = new Set(migrated.map((b) => b.id));
    const merged = [...migrated];
    let maxOrder = migrated.reduce((max, b) => Math.max(max, b.order), -1);
    for (const db of defaultBookmarks) {
      if (!existingIds.has(db.id)) {
        maxOrder++;
        merged.push({ ...db, order: maxOrder });
        needsSave = true;
      }
    }
    if (needsSave) {
      storage.set("bookmarks", merged);
    }
    return merged;
  }
  const copy = defaultBookmarks.map((b) => ({ ...b }));
  storage.set("bookmarks", copy);
  return copy;
}

function saveBookmarks(bookmarks: Bookmark[]): void {
  storage.set("bookmarks", bookmarks);
}

function generateId(): string {
  return crypto.randomUUID();
}

export function AppShell() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperSource | null>(loadWallpaperSource);
  const [uploadedWallpapers, setUploadedWallpapers] = useState<UploadedWallpaperMeta[]>([]);
  const wallpaper = useWallpaper(selectedWallpaper);
  useWallpaperColor(wallpaper?.url ?? null, settings.theme);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    listWallpaperImages().then(setUploadedWallpapers);
  }, []);

  const engine = searchEngines.find((e) => e.id === settings.searchEngineId) ?? searchEngines[0];

  const handleBookmarkOpen = useCallback((bookmark: Bookmark) => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  }, []);

  const handleBookmarkAdd = useCallback(
    (data: Omit<Bookmark, "id" | "order">) => {
      const maxOrder = bookmarks.reduce((max, b) => Math.max(max, b.order), -1);
      const newBookmark: Bookmark = {
        id: generateId(),
        ...data,
        order: maxOrder + 1,
      };
      setBookmarks((prev) => [...prev, newBookmark]);
    },
    [bookmarks],
  );

  const handleBookmarkEdit = useCallback((updated: Bookmark) => {
    setBookmarks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const handleBookmarkDelete = useCallback((id: string) => {
    setBookmarks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      return filtered.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const handleBookmarkTrackUse = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => prev.map((b) =>
      b.id === bookmark.id ? { ...b, lastUsedAt: new Date().toISOString() } : b,
    ));
  }, []);

  const handleCategoryAdd = useCallback(
    (data: Omit<Category, "id" | "order">) => {
      const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), -1);
      const newCategory: Category = {
        id: generateId(),
        ...data,
        order: maxOrder + 1,
      };
      setCategories((prev) => [...prev, newCategory]);
    },
    [categories],
  );

  const handleCategoryEdit = useCallback((updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const handleCategoryDelete = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setBookmarks((prev) => prev.filter((b) => b.categoryId !== id));
  }, []);

  const handleSettingsUpdate = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, []);

  const handleWallpaperChange = useCallback((source: WallpaperSource | null) => {
    setSelectedWallpaper(source);
    saveWallpaperSource(source);
  }, []);

  const handleUploadWallpaper = useCallback(async (file: File) => {
    const meta = await saveWallpaperImage(file);
    setUploadedWallpapers((prev) => [...prev, meta]);
    setSelectedWallpaper({ kind: "upload", id: meta.id });
    saveWallpaperSource({ kind: "upload", id: meta.id });
  }, []);

  const handleDeleteUploadWallpaper = useCallback(async (id: string) => {
    await deleteWallpaperImage(id);
    setUploadedWallpapers((prev) => prev.filter((m) => m.id !== id));
    if (selectedWallpaper?.kind === "upload" && selectedWallpaper.id === id) {
      setSelectedWallpaper(null);
      saveWallpaperSource(null);
    }
  }, [selectedWallpaper]);

  return (
    <ThemeProvider theme={settings.theme}>
      {wallpaper && (
        <>
          {wallpaper.isVideo ? (
            <video
              className="wallpaper-video"
              src={wallpaper.url}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            />
          ) : (
            <div
              className="wallpaper-bg"
              style={{ backgroundImage: `url(${wallpaper.url})` }}
              aria-hidden="true"
            />
          )}
          <div className="wallpaper-overlay" aria-hidden="true" />
        </>
      )}
      <Sidebar
        categories={categories}
        bookmarks={bookmarks}
        onBookmarkOpen={handleBookmarkOpen}
        onBookmarkAdd={handleBookmarkAdd}
        onBookmarkEdit={handleBookmarkEdit}
        onBookmarkDelete={handleBookmarkDelete}
        onBookmarkReorder={(b) => setBookmarks(b)}
        onCategoryAdd={handleCategoryAdd}
        onCategoryEdit={handleCategoryEdit}
        onCategoryDelete={handleCategoryDelete}
      />
      <div className="page-scroller">
        <section className="page page--hero">
          <main className="app-main">
            <div className="hero-section">
              <Clock />
              <SearchBar engine={engine} />
            </div>
            <RecentBookmarks
              bookmarks={bookmarks}
              onOpen={handleBookmarkOpen}
              onTrackUse={handleBookmarkTrackUse}
            />
          </main>
          <Quote show={settings.showQuote} />
        </section>
        <section className="page page--workspace">
          <Workspace />
        </section>
      </div>
      <footer className="app-footer">
        <GlassIcon
          size={36}
          variant="interactive"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
        >
          <Icon name="settings" size={18} />
        </GlassIcon>
      </footer>
      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdate={handleSettingsUpdate}
        selectedWallpaper={selectedWallpaper}
        onWallpaperChange={handleWallpaperChange}
        uploadedWallpapers={uploadedWallpapers}
        onUploadWallpaper={handleUploadWallpaper}
        onDeleteUploadWallpaper={handleDeleteUploadWallpaper}
      />
    </ThemeProvider>
  );
}