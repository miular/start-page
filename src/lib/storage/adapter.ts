export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export type { StorageAdapter as StorageAdapterType };

const STORAGE_PREFIX = "start-page-v2.";

export function createStorageAdapter(): StorageAdapter {
  return {
    get<T>(key: string): T | null {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw === null) return null;
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T): void {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      } catch {
        console.warn("Storage write failed for key:", key);
      }
    },
    remove(key: string): void {
      try {
        localStorage.removeItem(STORAGE_PREFIX + key);
      } catch {
        console.warn("Storage remove failed for key:", key);
      }
    },
  };
}

export const storage = createStorageAdapter();