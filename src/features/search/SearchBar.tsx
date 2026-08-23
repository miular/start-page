import { useState, useCallback, useRef } from "react";
import { GlassSurface, GlassIcon } from "../../ui/glass";
import { Icon } from "../../ui/icon";
import type { SearchEngine } from "../../types/domain";
import { buildSearchUrl } from "../../lib/search";

type SearchBarProps = {
  engine: SearchEngine;
};

export function SearchBar({ engine }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      const url = buildSearchUrl(engine, trimmed);
      if (url) {
        window.location.href = url;
      }
    },
    [query, engine],
  );

  return (
    <GlassSurface variant="interactive" enhancement="auto" as="form" className="search-bar" onSubmit={handleSubmit}>
      <GlassIcon size={28} variant="static">
        <Icon name="search" size={14} />
      </GlassIcon>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search the web..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      <kbd className="search-hint">⌘K</kbd>
    </GlassSurface>
  );
}