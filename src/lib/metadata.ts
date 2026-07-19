import type { Metadata } from "next";
import { siteConfig } from "./constants";

// ---------------------------------------------------------------------------
// Shared metadata generator
// ---------------------------------------------------------------------------

interface PageMeta {
  title: string;
  description?: string;
  /** Relative path (e.g. "/tutorials/intro-to-qubits") */
  path?: string;
  /** Override the default OG image */
  ogImage?: string;
  /** Prevent indexing (e.g. draft previews) */
  noIndex?: boolean;
  /** ISO-8601 published date (for articles) */
  publishedTime?: string;
  /** ISO-8601 last-modified date (for articles) */
  modifiedTime?: string;
  /** Article tags for OG */
  tags?: string[];
  /** Article type override ("article" | "website") */
  type?: "article" | "website";
}

/**
 * Generate a fully-populated Next.js `Metadata` object.
 *
 * Usage (in a page or layout):
 * ```ts
 * export const metadata = generateMetadata({ title: "Tutorials" });
 * ```
 */
export function generateMetadata(page: PageMeta): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "",
    ogImage = siteConfig.defaultOgImage,
    noIndex = false,
    publishedTime,
    modifiedTime,
    tags,
    type = "website",
  } = page;

  const canonicalUrl = `${siteConfig.url}${path}`;
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${siteConfig.url}${ogImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),

    // --- Alternate / canonical -------------------------------------------
    alternates: {
      canonical: canonicalUrl,
      types: {
        "application/rss+xml": `${siteConfig.url}/feed.xml`,
      },
    },

    // --- Open Graph -------------------------------------------------------
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(tags && { tags }),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // --- Twitter -----------------------------------------------------------
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.social.twitterHandle,
      creator: siteConfig.social.twitterHandle,
      images: [ogImageUrl],
    },

    // --- Robots ------------------------------------------------------------
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
  };
}
