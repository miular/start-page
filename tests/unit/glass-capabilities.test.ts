import { describe, it, expect, beforeAll } from "vitest";

describe("glass-capabilities", () => {
  beforeAll(() => {
    globalThis.CSS = { supports: () => true } as unknown as typeof CSS;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it("detects glass capabilities", async () => {
    const { detectGlassCapabilities } = await import("../../src/lib/capabilities/glass-capabilities");
    const caps = detectGlassCapabilities();
    expect(caps).toHaveProperty("backdropFilter");
    expect(caps).toHaveProperty("svgFilter");
    expect(caps).toHaveProperty("reducedMotion");
    expect(caps).toHaveProperty("reducedTransparency");
  });
});