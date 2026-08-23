import { AppShell } from "./AppShell";
import { useGlobalShortcuts } from "./use-global-shortcuts";

export default function App() {
  useGlobalShortcuts();
  return <AppShell />;
}