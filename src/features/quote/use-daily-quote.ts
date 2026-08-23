import { useMemo } from "react";
import { quotes } from "../../data/quotes";
import { getDateSeed } from "../../lib/date";
import type { Quote } from "../../types/domain";

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getQuoteForDate(date: Date): Quote {
  const seed = getDateSeed(date);
  const hash = hashString(seed);
  const index = hash % quotes.length;
  return quotes[index];
}

export function useDailyQuote(date: Date = new Date()): Quote {
  return useMemo(() => getQuoteForDate(date), [date]);
}