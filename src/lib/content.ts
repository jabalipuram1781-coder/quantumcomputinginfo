import postsCache from "./posts-cache.json";

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

export interface Article {
  /** URL-safe slug derived from the filename (without .mdx) */
  slug: string;
  /** The sub-directory the file came from (articles | news | …) */
  section: string;
  /** Raw MDX body content */
  content: string;

  // --- Front-matter fields ---------------------------------------------------
  title: string;
  description: string;
  publishDate: string;
  updatedDate?: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  featured: boolean;
  draft: boolean;
  readingTime: number;
  /** Optional SEO-specific title override */
  seoTitle?: string;
  /** Optional SEO description override */
  seoDescription?: string;
  source?: "original" | "aggregated";
  sourceUrl?: string;
  sourceName?: string;
}

const posts = postsCache as Article[];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve every published post across all content sub-directories, sorted
 * newest-first by `publishDate`.
 */
export async function getAllPosts(): Promise<Article[]> {
  return posts;
}

/**
 * Fetch a single post by its slug. Searches across all sub-directories.
 */
export async function getPostBySlug(slug: string): Promise<Article | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}

/**
 * All posts that belong to a given category slug.
 */
export async function getPostsByCategory(category: string): Promise<Article[]> {
  return posts.filter((p) => p.category === category);
}

/**
 * Posts explicitly marked `featured: true` in their frontmatter.
 */
export async function getFeaturedPosts(): Promise<Article[]> {
  return posts.filter((p) => p.featured);
}

/**
 * Unique category slugs across every post.
 */
export async function getAllCategories(): Promise<string[]> {
  return [...new Set(posts.map((p) => p.category))];
}

/**
 * Unique tags across every post, sorted alphabetically.
 */
export async function getAllTags(): Promise<string[]> {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}

/**
 * Find posts related to the current one based on matching category and tags.
 * The current post itself is excluded from results.
 */
export async function getRelatedPosts(
  slug: string,
  category: string,
  tags: string[],
  limit = 4,
): Promise<Article[]> {
  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === category) score += 3;
      for (const tag of tags) {
        if (p.tags.includes(tag)) score += 1;
      }
      return { post: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}
