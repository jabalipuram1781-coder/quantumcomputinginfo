import Fuse, { type IFuseOptions } from "fuse.js";
import type { Article } from "./content";

// ---------------------------------------------------------------------------
// Searchable article shape (stripped-down for the client bundle)
// ---------------------------------------------------------------------------

export interface SearchableArticle {
  slug: string;
  section: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishDate: string;
  coverImage?: string;
  readingTime: number;
}

// ---------------------------------------------------------------------------
// Fuse.js configuration
// ---------------------------------------------------------------------------

const fuseOptions: IFuseOptions<SearchableArticle> = {
  // Fields to index with individual weighting
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.25 },
    { name: "tags", weight: 0.2 },
    { name: "category", weight: 0.15 },
  ],
  // Tuning knobs
  threshold: 0.35,          // 0 = perfect match, 1 = match anything
  distance: 200,             // how far from the expected position a match can be
  minMatchCharLength: 2,     // ignore single-character matches
  includeScore: true,
  includeMatches: true,
  useExtendedSearch: false,
  ignoreLocation: true,      // search the full string, not just near the start
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert full `Article` objects into the lean `SearchableArticle` shape
 * suitable for building a client-side Fuse index.
 */
export function toSearchable(articles: Article[]): SearchableArticle[] {
  return articles.map((a) => ({
    slug: a.slug,
    section: a.section,
    title: a.title,
    description: a.description,
    category: a.category,
    tags: a.tags,
    publishDate: a.publishDate,
    coverImage: a.coverImage,
    readingTime: a.readingTime,
  }));
}

/**
 * Build a Fuse.js search index from a list of searchable articles.
 * Call this once (e.g. inside a React context or server action) then reuse
 * the returned `Fuse` instance for repeated queries.
 */
export function createSearchIndex(
  articles: SearchableArticle[],
): Fuse<SearchableArticle> {
  return new Fuse(articles, fuseOptions);
}

/**
 * Convenience wrapper: build an ephemeral index and run a query in one shot.
 * For repeated searches prefer `createSearchIndex()` + `index.search()`.
 */
export function searchArticles(
  query: string,
  articles: SearchableArticle[],
  limit = 10,
): SearchableArticle[] {
  if (!query.trim()) return [];

  const index = createSearchIndex(articles);
  return index
    .search(query, { limit })
    .map((result) => result.item);
}
