import { useEffect, type ReactNode } from "react";
import type { ThemeMode } from "../../types/domain";

type ThemeProviderProps = {
  theme: ThemeMode;
  children: ReactNode;
};

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}