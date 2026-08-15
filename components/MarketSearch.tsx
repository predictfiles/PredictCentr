"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/SearchIcon";
import type { MarketSearchEntry } from "@/lib/markets";

const MAX_RESULTS = 6;

/**
 * Homepage task bar's market search -- plain substring match against each
 * market's title (already includes the candidate/team/person name, e.g.
 * "2028 U.S. Presidential Election Winner -- Donald Trump"), so searching
 * "Trump" surfaces that market without a separate keywords/aliases field.
 * Client-side only: ~30 markets is small enough that filtering in the
 * browser as you type is simpler than a search API.
 */
export function MarketSearch({ items }: { items: MarketSearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => item.title.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
  }, [query, items]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="category-bar-search" ref={containerRef}>
      <label htmlFor="market-search-input" className="category-bar-search-label">
        <SearchIcon className="category-bar-icon" />
        Search Markets
      </label>
      <input
        id="market-search-input"
        type="search"
        className="category-bar-search-input"
        placeholder="e.g. Trump, Warriors..."
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim() !== "" && (
        <ul className="category-bar-search-results">
          {results.length > 0 ? (
            results.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}/`}
                  className={`category-bar-search-result category-bar-search-result-${item.category}`}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="category-bar-search-empty">No markets found</li>
          )}
        </ul>
      )}
    </div>
  );
}
