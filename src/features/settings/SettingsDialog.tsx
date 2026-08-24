import { useState } from "react";
import { Dialog } from "../../ui/dialog";
import type { Settings, SearchEngine, ThemeMode } from "../../types/domain";
import { searchEngines as allEngines } from "../../data/search-engines";
import { getWallpaperEntriesWithPath } from "../../lib/wallpaper";
import { getTerminalToken, setTerminalToken, clearTerminalToken } from "../../lib/terminal/token";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  selectedWallpaperPath: string | null;
  onWallpaperChange: (path: string | null) => void;
};

export function SettingsDialog({
  open,
  onClose,
  settings,
  onUpdate,
  selectedWallpaperPath,
  onWallpaperChange,
}: SettingsDialogProps) {
  const wallpapers = getWallpaperEntriesWithPath();
  const [tokenInput, setTokenInput] = useState("");

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
            className={`wallpaper-thumb ${!selectedWallpaperPath && !settings.customWallpaperUrl ? "wallpaper-thumb--active" : ""}`}
            onClick={() => {
              onWallpaperChange(null);
              onUpdate({ ...settings, customWallpaperUrl: undefined });
            }}
            title="Random"
          >
            <span className="wallpaper-thumb-label">Random</span>
          </button>
          {wallpapers.map((wp) => (
            <button
              key={wp.path}
              className={`wallpaper-thumb ${selectedWallpaperPath === wp.path ? "wallpaper-thumb--active" : ""}`}
              onClick={() => {
                onWallpaperChange(wp.path);
                onUpdate({ ...settings, customWallpaperUrl: undefined });
              }}
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
        </div>
        <div className="settings-custom-wallpaper">
          <label className="form-field">
            <span className="form-label">Custom wallpaper URL</span>
            <input
              className="form-input"
              type="text"
              value={settings.customWallpaperUrl ?? ""}
              onChange={(e) => {
                const val = e.target.value.trim();
                onWallpaperChange(null);
                onUpdate({ ...settings, customWallpaperUrl: val || undefined });
              }}
              placeholder="https://example.com/wallpaper.jpg"
            />
          </label>
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