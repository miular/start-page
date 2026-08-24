import { storage } from "../storage";

const TOKEN_KEY = "terminal-token";

export function getTerminalToken(): string | null {
  return storage.get<string>(TOKEN_KEY);
}

export function setTerminalToken(token: string): void {
  storage.set(TOKEN_KEY, token);
}

export function clearTerminalToken(): void {
  storage.remove(TOKEN_KEY);
}