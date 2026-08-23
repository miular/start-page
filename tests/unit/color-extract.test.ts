import { describe, it, expect } from "vitest";
import { rgbToHsl, deriveGlassTokens } from "../../src/lib/wallpaper/color-extract";

describe("rgbToHsl", () => {
  it("converts pure red", () => {
    const { h, s, l } = rgbToHsl(255, 0, 0);
    expect(h).toBeCloseTo(0, 0);
    expect(s).toBeCloseTo(100, 0);
    expect(l).toBeCloseTo(50, 0);
  });

  it("converts white", () => {
    const { s, l } = rgbToHsl(255, 255, 255);
    expect(s).toBeCloseTo(0, 0);
    expect(l).toBeCloseTo(100, 0);
  });

  it("converts black", () => {
    const { s, l } = rgbToHsl(0, 0, 0);
    expect(s).toBeCloseTo(0, 0);
    expect(l).toBeCloseTo(0, 0);
  });
});

describe("deriveGlassTokens", () => {
  it("returns all expected keys", () => {
    const tokens = deriveGlassTokens({ h: 210, s: 40, l: 50 }, false);
    expect(Object.keys(tokens).sort()).toEqual(
      [
        "--glass-bg",
        "--glass-bg-hover",
        "--glass-bg-active",
        "--glass-border",
        "--glass-highlight",
      ].sort(),
    );
  });

  it("carries wallpaper hue into the tint", () => {
    const tokens = deriveGlassTokens({ h: 210, s: 40, l: 50 }, false);
    expect(tokens["--glass-bg"]).toContain("210");
  });

  it("clamps saturation for readability", () => {
    const tokens = deriveGlassTokens({ h: 210, s: 90, l: 50 }, true);
    const [, s] = /hsla\(\d+, (\d+)%/.exec(tokens["--glass-bg"]) ?? [];
    expect(Number(s)).toBeLessThanOrEqual(28);
  });

  it("produces dark tokens for dark theme and light for light", () => {
    const dark = deriveGlassTokens({ h: 210, s: 40, l: 50 }, true);
    const light = deriveGlassTokens({ h: 210, s: 40, l: 50 }, false);
    expect(dark["--glass-bg"]).not.toBe(light["--glass-bg"]);
  });
});