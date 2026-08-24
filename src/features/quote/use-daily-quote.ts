import { useMemo } from "react";
import { quotes } from "../../data/quotes";
import type { Quote } from "../../types/domain";

export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

export function useDailyQuote(): Quote {
  return useMemo(() => getRandomQuote(), []);
}