import { siteConfig } from "./constants";
import type { Article } from "./content";

// ---------------------------------------------------------------------------
// Types for JSON-LD — thin wrappers to stay type-safe without a huge dep
// ---------------------------------------------------------------------------

type JsonLd = Record<string, unknown>;

// ---------------------------------------------------------------------------
// BlogPosting (individual article pages)
// ---------------------------------------------------------------------------

export function generateBlogPostingLD(article: Article): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: article.coverImage
      ? `${siteConfig.url}${article.coverImage}`
      : `${siteConfig.url}${siteConfig.defaultOgImage}`,
    datePublished: article.publishDate,
    ...(article.updatedDate && { dateModified: article.updatedDate }),
    author: {
      "@type": "Person",
      name: article.author,
      url: siteConfig.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/${article.section}/${article.slug}`,
    },
    keywords: article.tags.join(", "),
    wordCount: article.content.split(/\s+/).length,
    articleSection: article.category,
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function generateBreadcrumbLD(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

export function generateOrganizationLD(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.youtube,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${siteConfig.url}/about`,
    },
  };
}

// ---------------------------------------------------------------------------
// WebSite (with SearchAction for Google Sitelinks search box)
// ---------------------------------------------------------------------------

export function generateWebSiteLD(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------
// Helper: render JSON-LD as a <script> tag string (for use in <head>)
// ---------------------------------------------------------------------------

/**
 * Returns a React-friendly props object for a `<script>` tag.
 *
 * Usage in a Server Component:
 * ```tsx
 * <script {...jsonLdScriptProps(generateWebSiteLD())} />
 * ```
 */
export function jsonLdScriptProps(data: JsonLd) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
