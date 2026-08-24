import type { ReactNode } from "react";

type Tab = "markdown" | "terminal";

type Props = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  actions?: ReactNode;
};

const tabs: { id: Tab; label: string }[] = [
  { id: "markdown", label: "Markdown" },
  { id: "terminal", label: "PowerShell" },
];

export function WorkspaceTabs({ activeTab, onChange, actions }: Props) {
  return (
    <div className="workspace-tabs">
      <div className="workspace-tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`workspace-tab ${activeTab === tab.id ? "workspace-tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {actions && <div className="workspace-tabs-actions">{actions}</div>}
    </div>
  );
}