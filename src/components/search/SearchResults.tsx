import { ArticleCard } from "@/components/blog/ArticleCard";
import { SearchX } from "lucide-react";

import type { Article } from "@/lib/content";

interface SearchResultsProps {
  results: Article[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/40">Enter a search term to find articles.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-16 text-center">
        <SearchX className="mx-auto mb-4 size-12 text-white/20" />
        <h3 className="text-lg font-semibold text-white/80">No results found</h3>
        <p className="mt-2 text-sm text-white/40">
          No articles found for &ldquo;{query}&rdquo;. Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/50">
        Found{" "}
        <span className="font-semibold text-white">
          {results.length}
        </span>{" "}
        {results.length === 1 ? "result" : "results"} for &ldquo;
        <span className="text-violet-400">{query}</span>&rdquo;
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
