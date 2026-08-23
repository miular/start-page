import { describe, it, expect } from "vitest";
import { buildSearchUrl, isValidUrl, normalizeUrl } from "../../src/lib/search/search-service";
import type { SearchEngine } from "../../src/types/domain";

const google: SearchEngine = { id: "google", name: "Google", urlTemplate: "https://www.google.com/search?q=%s" };

describe("search-service", () => {
  it("buildSearchUrl replaces %s with encoded query", () => {
    expect(buildSearchUrl(google, "hello world")).toBe("https://www.google.com/search?q=hello%20world");
  });

  it("buildSearchUrl returns empty for empty query", () => {
    expect(buildSearchUrl(google, "  ")).toBe("");
  });

  it("isValidUrl accepts http/https", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("isValidUrl rejects javascript:", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
  });

  it("normalizeUrl adds https:// if missing", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  it("normalizeUrl preserves existing protocol", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });
});