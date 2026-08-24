import { describe, it, expect } from "vitest";
import { getRandomQuote } from "../../src/features/quote/use-daily-quote";

describe("daily quote", () => {
  it("returns a quote with id and text", () => {
    const quote = getRandomQuote();
    expect(quote).toHaveProperty("id");
    expect(quote).toHaveProperty("text");
  });

  it("returns a valid quote from the list", () => {
    const quote = getRandomQuote();
    expect(quote.id).toMatch(/^q\d+$/);
  });
});