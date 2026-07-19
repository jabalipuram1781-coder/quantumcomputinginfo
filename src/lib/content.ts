import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime } from "./utils";

// ---------------------------------------------------------------------------
// Content directory — all MDX posts live here
// ---------------------------------------------------------------------------

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Sub-directories to scan for posts.  Each maps to a logical section of the
 * site (articles, news, tutorials, research).
 */
const CONTENT_SUBDIRS = ["articles", "news", "tutorials", "research"] as const;

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

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the post should be hidden from public listings.
 * In production we hide drafts *and* posts with a future `publishDate`.
 */
function isHiddenPost(data: Record<string, unknown>): boolean {
  if (process.env.NODE_ENV === "development") return false;

  if (data.draft === true) return true;
  if (typeof data.publishDate === "string") {
    const pub = new Date(data.publishDate);
    if (pub.getTime() > Date.now()) return true;
  }
  return false;
}

/**
 * Parse a single MDX file into an `Article` object.
 */
function parseFile(filePath: string, section: string): Article | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (isHiddenPost(data)) return null;

  const slug = path.basename(filePath, ".mdx");

  return {
    slug,
    section,
    content,
    title: (data.title as string) ?? slug,
    description: (data.description as string) ?? "",
    publishDate: (data.publishDate as string) ?? (data.date as string) ?? "",
    updatedDate: data.updatedDate as string | undefined,
    author: (data.author as string) ?? "Quantum Editorial Team",
    authorAvatar: data.authorAvatar as string | undefined,
    category: (data.category as string) ?? section,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    coverImage: data.coverImage as string | undefined,
    coverImageAlt: data.coverImageAlt as string | undefined,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    readingTime: calculateReadingTime(content),
    seoTitle: data.seoTitle as string | undefined,
    seoDescription: data.seoDescription as string | undefined,
    source: (data.source as "original" | "aggregated" | undefined) ?? "original",
    sourceUrl: data.sourceUrl as string | undefined,
    sourceName: data.sourceName as string | undefined,
  };
}

/**
 * Collect all `.mdx` files from a single directory (non-recursive).
 */
function collectMdxFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dirPath, f));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve every published post across all content sub-directories, sorted
 * newest-first by `publishDate`.
 */
export async function getAllPosts(): Promise<Article[]> {
  const posts: Article[] = [];

  for (const subdir of CONTENT_SUBDIRS) {
    const dir = path.join(CONTENT_ROOT, subdir);
    const files = collectMdxFiles(dir);
    for (const file of files) {
      const article = parseFile(file, subdir);
      if (article) posts.push(article);
    }
  }

  // Also check the root content/ directory for uncategorised MDX files.
  const rootFiles = collectMdxFiles(CONTENT_ROOT);
  for (const file of rootFiles) {
    const article = parseFile(file, "articles");
    if (article) posts.push(article);
  }

  return posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}

/**
 * Fetch a single post by its slug. Searches across all sub-directories.
 */
export async function getPostBySlug(slug: string): Promise<Article | null> {
  for (const subdir of CONTENT_SUBDIRS) {
    const filePath = path.join(CONTENT_ROOT, subdir, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return parseFile(filePath, subdir);
    }
  }

  // Fallback: check the root content/ dir.
  const rootPath = path.join(CONTENT_ROOT, `${slug}.mdx`);
  if (fs.existsSync(rootPath)) {
    return parseFile(rootPath, "articles");
  }

  return null;
}

/**
 * All posts that belong to a given category slug.
 */
export async function getPostsByCategory(category: string): Promise<Article[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === category);
}

/**
 * Posts explicitly marked `featured: true` in their frontmatter.
 */
export async function getFeaturedPosts(): Promise<Article[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.featured);
}

/**
 * Unique category slugs across every post.
 */
export async function getAllCategories(): Promise<string[]> {
  const all = await getAllPosts();
  return [...new Set(all.map((p) => p.category))];
}

/**
 * Unique tags across every post, sorted alphabetically.
 */
export async function getAllTags(): Promise<string[]> {
  const all = await getAllPosts();
  const tagSet = new Set<string>();
  for (const post of all) {
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
  const all = await getAllPosts();

  const scored = all
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
