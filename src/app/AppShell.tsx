import { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Clock } from "../features/clock";
import { Quote } from "../features/quote";
import { SearchBar } from "../features/search";
import { BookmarkList } from "../features/bookmarks";
import { SettingsDialog } from "../features/settings";
import { GlassIcon } from "../ui/glass";
import { Icon } from "../ui/icon";
import { storage } from "../lib/storage";
import { useRandomWallpaper, useWallpaperColor } from "../lib/wallpaper";
import { defaultBookmarks } from "../data/default-bookmarks";
import { searchEngines } from "../data/search-engines";
import type { Bookmark, Settings } from "../types/domain";

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  searchEngineId: "google",
  showQuote: true,
};

function loadSettings(): Settings {
  const stored = storage.get<Settings>("settings");
  return stored ?? DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings): void {
  storage.set("settings", settings);
}

function loadBookmarks(): Bookmark[] {
  const stored = storage.get<Bookmark[]>("bookmarks");
  if (stored && stored.length > 0) return stored;
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
  const [showSettings, setShowSettings] = useState(false);
  const wallpaper = useRandomWallpaper();
  useWallpaperColor(wallpaper, settings.theme);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

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

  const handleSettingsUpdate = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, []);

  return (
    <ThemeProvider theme={settings.theme}>
      {wallpaper && (
        <>
          <div
            className="wallpaper-bg"
            style={{ backgroundImage: `url(${wallpaper})` }}
            aria-hidden="true"
          />
          <div className="wallpaper-overlay" aria-hidden="true" />
        </>
      )}
      <div className="app-shell">
        <main className="app-main">
          <div className="hero-section">
            <Clock />
            <SearchBar engine={engine} />
          </div>
          <BookmarkList
            bookmarks={bookmarks}
            onOpen={handleBookmarkOpen}
            onAdd={handleBookmarkAdd}
            onEdit={handleBookmarkEdit}
            onDelete={handleBookmarkDelete}
            onReorder={(b) => setBookmarks(b)}
          />
        </main>
        <Quote show={settings.showQuote} />
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
        />
      </div>
    </ThemeProvider>
  );
}