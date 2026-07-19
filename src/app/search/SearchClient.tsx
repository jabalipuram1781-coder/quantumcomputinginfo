"use client";

import * as React from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { toSearchable, searchArticles } from "@/lib/search";
import type { Article } from "@/lib/content";

interface SearchClientProps {
  initialArticles: Article[];
}

export function SearchClient({ initialArticles }: SearchClientProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);

  const searchable = React.useMemo(() => toSearchable(initialArticles), [initialArticles]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const searchRes = searchArticles(q, searchable, 20);
    
    // Map back to maintain the correct sorted order of matches returned by Fuse.js
    const matchedArticles = searchRes
      .map((item) => initialArticles.find((a) => a.slug === item.slug))
      .filter(Boolean) as Article[];
      
    setResults(matchedArticles);
  };

  return (
    <div className="space-y-8">
      <SearchBar onSearch={handleSearch} defaultValue={query} />
      <SearchResults results={results} query={query} />
    </div>
  );
}
