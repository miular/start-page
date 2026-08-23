import { Dialog } from "../../ui/dialog";
import type { Settings, SearchEngine, ThemeMode } from "../../types/domain";
import { searchEngines as allEngines } from "../../data/search-engines";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (settings: Settings) => void;
};

export function SettingsDialog({ open, onClose, settings, onUpdate }: SettingsDialogProps) {
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
    </Dialog>
  );
}