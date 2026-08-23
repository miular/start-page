import { useDailyQuote } from "./use-daily-quote";

type QuoteProps = {
  show: boolean;
};

export function Quote({ show }: QuoteProps) {
  const quote = useDailyQuote();

  if (!show) return null;

  return (
    <blockquote className="quote">
      <p className="quote-text">"{quote.text}"</p>
      {quote.author && <cite className="quote-author">— {quote.author}</cite>}
    </blockquote>
  );
}