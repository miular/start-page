import { describe, it, expect } from "vitest";
import { getQuoteForDate, hashString } from "../../src/features/quote/use-daily-quote";

describe("daily quote", () => {
  it("returns a quote for a given date", () => {
    const quote = getQuoteForDate(new Date(2024, 7, 23));
    expect(quote).toHaveProperty("id");
    expect(quote).toHaveProperty("text");
  });

  it("returns the same quote for the same date", () => {
    const quote1 = getQuoteForDate(new Date(2024, 7, 23));
    const quote2 = getQuoteForDate(new Date(2024, 7, 23));
    expect(quote1.id).toBe(quote2.id);
  });

  it("returns different quotes for different dates", () => {
    const quote1 = getQuoteForDate(new Date(2024, 0, 1));
    const quote2 = getQuoteForDate(new Date(2024, 11, 31));
    expect(quote1.id).not.toBe(quote2.id);
  });

  it("hashString produces deterministic results", () => {
    expect(hashString("2024-08-23")).toBe(hashString("2024-08-23"));
  });
});