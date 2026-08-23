import { describe, it, expect, beforeEach } from "vitest";
import { createStorageAdapter } from "../../src/lib/storage/adapter";

describe("storage adapter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves values", () => {
    const storage = createStorageAdapter();
    storage.set("test-key", { hello: "world" });
    expect(storage.get("test-key")).toEqual({ hello: "world" });
  });

  it("returns null for missing keys", () => {
    const storage = createStorageAdapter();
    expect(storage.get("nonexistent")).toBeNull();
  });

  it("removes values", () => {
    const storage = createStorageAdapter();
    storage.set("test-key", "value");
    storage.remove("test-key");
    expect(storage.get("test-key")).toBeNull();
  });

  it("handles malformed JSON gracefully", () => {
    const storage = createStorageAdapter();
    localStorage.setItem("start-page.bad", "not-json");
    expect(storage.get("bad")).toBeNull();
  });
});