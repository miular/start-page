import { useState, useRef, useEffect } from "react";
import { Dialog } from "../../ui/dialog";
import type { Settings, SearchEngine, ThemeMode, WallpaperSource } from "../../types/domain";
import type { UploadedWallpaperMeta } from "../../lib/wallpaper/image-store";
import { getWallpaperBlob } from "../../lib/wallpaper/image-store";
import { searchEngines as allEngines } from "../../data/search-engines";
import { getWallpaperEntriesWithPath } from "../../lib/wallpaper";
import { getTerminalToken, setTerminalToken, clearTerminalToken } from "../../lib/terminal/token";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  selectedWallpaper: WallpaperSource | null;
  onWallpaperChange: (source: WallpaperSource | null) => void;
  uploadedWallpapers: UploadedWallpaperMeta[];
  onUploadWallpaper: (file: File) => void;
  onDeleteUploadWallpaper: (id: string) => void;
};

export function SettingsDialog({
  open,
  onClose,
  settings,
  onUpdate,
  selectedWallpaper,
  onWallpaperChange,
  uploadedWallpapers,
  onUploadWallpaper,
  onDeleteUploadWallpaper,
}: SettingsDialogProps) {
  const presets = getWallpaperEntriesWithPath();
  const [tokenInput, setTokenInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function isSelected(source: WallpaperSource | null): boolean {
    if (!source && !selectedWallpaper) return true;
    if (!source || !selectedWallpaper) return false;
    if (source.kind !== selectedWallpaper.kind) return false;
    if (source.kind === "preset") return source.path === (selectedWallpaper as WallpaperSource & { kind: "preset" }).path;
    return source.id === (selectedWallpaper as WallpaperSource & { kind: "upload" }).id;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onUploadWallpaper(file);
    e.target.value = "";
  }

  return (
    <Dialog open={open} onClose={onClose} title="Settings">
      <div className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        <div className="settings-options">
          {(["system", "light", "dark"] as ThemeMode[]).map((theme) => (
            <label key={theme} className="settings-radio">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={settings.theme === theme}
                onChange={() => onUpdate({ ...settings, theme })}
              />
              <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Wallpaper</h3>
        <div className="wallpaper-picker">
          <button
            className={`wallpaper-thumb ${!selectedWallpaper ? "wallpaper-thumb--active" : ""}`}
            onClick={() => onWallpaperChange(null)}
            title="Random"
          >
            <span className="wallpaper-thumb-label">Random</span>
          </button>
          {presets.map((wp) => (
            <button
              key={wp.path}
              className={`wallpaper-thumb ${isSelected({ kind: "preset", path: wp.path }) ? "wallpaper-thumb--active" : ""}`}
              onClick={() => onWallpaperChange({ kind: "preset", path: wp.path })}
              title={wp.path}
            >
              {wp.isVideo ? (
                <>
                  <video src={wp.url} muted playsInline className="wallpaper-thumb-media" />
                  <span className="wallpaper-thumb-badge">Video</span>
                </>
              ) : (
                <img src={wp.url} alt="" className="wallpaper-thumb-media" />
              )}
            </button>
          ))}
          {uploadedWallpapers.map((meta) => (
            <div key={meta.id} className="wallpaper-thumb-wrapper">
              <button
                className={`wallpaper-thumb ${isSelected({ kind: "upload", id: meta.id }) ? "wallpaper-thumb--active" : ""}`}
                onClick={() => onWallpaperChange({ kind: "upload", id: meta.id })}
                title={meta.name}
              >
                <UploadThumbnail id={meta.id} name={meta.name} />
              </button>
              <button
                className="wallpaper-thumb-remove"
                onClick={(e) => { e.stopPropagation(); onDeleteUploadWallpaper(meta.id); }}
                aria-label={`Delete ${meta.name}`}
                title="Delete"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="settings-upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="settings-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Search engine</h3>
        <div className="settings-options">
          {allEngines.map((engine: SearchEngine) => (
            <label key={engine.id} className="settings-radio">
              <input
                type="radio"
                name="searchEngine"
                value={engine.id}
                checked={settings.searchEngineId === engine.id}
                onChange={() => onUpdate({ ...settings, searchEngineId: engine.id })}
              />
              <span>{engine.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Daily quote</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.showQuote}
            onChange={(e) => onUpdate({ ...settings, showQuote: e.target.checked })}
          />
          <span>Show daily quote</span>
        </label>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Terminal</h3>
        <p className="settings-token-status">
          Status:{" "}
          {getTerminalToken() ? (
            <span className="settings-token-status--ok">Token configured</span>
          ) : (
            "Not configured"
          )}
        </p>
        <div className="settings-token-input">
          <input
            type="text"
            placeholder="Paste daemon token here..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button
            className="settings-token-btn"
            onClick={() => {
              if (tokenInput.trim()) {
                setTerminalToken(tokenInput.trim());
                setTokenInput("");
              }
            }}
          >
            Save
          </button>
          <button
            className="settings-token-btn"
            onClick={() => {
              clearTerminalToken();
              setTokenInput("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function UploadThumbnail({ id, name }: { id: string; name: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWallpaperBlob(id).then((blob) => {
      if (cancelled || !blob) return;
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (!url) {
    return <div className="wallpaper-thumb-media wallpaper-thumb-placeholder">{name[0].toUpperCase()}</div>;
  }
  return <img src={url} alt={name} className="wallpaper-thumb-media" />;
}