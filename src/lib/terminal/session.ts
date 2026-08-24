import { storage } from "../storage";

const SESSION_KEY = "terminal-session-id";
const MARKDOWN_KEY = "workspace-markdown-doc";

export function getSessionId(): string | null {
  return storage.get<string>(SESSION_KEY);
}

export function setSessionId(id: string): void {
  storage.set(SESSION_KEY, id);
}

export function clearSessionId(): void {
  storage.remove(SESSION_KEY);
}

export function getMarkdownDoc(): string | null {
  return storage.get<string>(MARKDOWN_KEY);
}

export function setMarkdownDoc(value: string): void {
  storage.set(MARKDOWN_KEY, value);
}