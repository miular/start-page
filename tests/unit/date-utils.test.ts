import { describe, it, expect } from "vitest";
import { formatTime, formatDate, getDateSeed } from "../../src/lib/date/date-utils";

describe("date-utils", () => {
  it("formatTime returns HH:MM format", () => {
    const date = new Date(2024, 0, 1, 9, 42, 0);
    expect(formatTime(date)).toBe("09:42");
  });

  it("formatDate returns weekday and date", () => {
    const date = new Date(2024, 7, 23);
    const result = formatDate(date);
    expect(result).toContain("23");
  });

  it("getDateSeed returns YYYY-MM-DD", () => {
    const date = new Date(2024, 7, 23);
    expect(getDateSeed(date)).toBe("2024-08-23");
  });
});