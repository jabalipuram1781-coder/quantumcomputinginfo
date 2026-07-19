import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------------------------------------
// Class-name helper (shadcn/ui standard)
// ---------------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

/**
 * Format an ISO date string into a human-friendly form.
 * e.g. "2025-06-15" → "June 15, 2025"
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Return relative time like "3 days ago", "2 months ago", etc.
 */
export function relativeDate(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "just now";
}

// ---------------------------------------------------------------------------
// Reading time
// ---------------------------------------------------------------------------

const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in minutes for a given block of text/MDX content.
 * Strips out code blocks and frontmatter to get a fairer count.
 */
export function calculateReadingTime(content: string): number {
  // Remove code blocks (fenced and indented)
  const cleaned = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/---[\s\S]*?---/g, "")
    .replace(/<[^>]+>/g, "");

  const words = cleaned
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

/**
 * Convert arbitrary text into a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove non-word chars (except hyphens)
    .replace(/[\s_]+/g, "-")     // collapse whitespace & underscores to hyphens
    .replace(/-+/g, "-")         // collapse duplicate hyphens
    .replace(/^-|-$/g, "");      // trim leading/trailing hyphens
}

// ---------------------------------------------------------------------------
// Text truncation
// ---------------------------------------------------------------------------

/**
 * Truncate text to a maximum length, appending "…" if truncated.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  // Walk back to the nearest space to avoid splitting words.
  const trimmed = text.slice(0, length);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "…";
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

/**
 * Absolutely resolve a path segment against the site URL.
 */
export function absoluteUrl(path: string): string {
  return `https://quantumcomputinginfo.com${path.startsWith("/") ? path : `/${path}`}`;
}
