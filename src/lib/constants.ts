// Site-wide configuration — single source of truth for QuantumComputingInfo.com

export const siteConfig = {
  name: "QuantumComputingInfo",
  url: "https://quantumcomputinginfo.com",
  description:
    "Your premier destination for quantum computing news, tutorials, research breakdowns, and career guidance. Explore the quantum frontier with in-depth articles and expert insights.",
  tagline: "Exploring the Quantum Frontier",
  language: "en-US",
  locale: "en_US",
  defaultOgImage: "/images/og-default.png",
  logo: "/images/logo.svg",
  favicon: "/favicon.ico",

  author: {
    name: "Quantum Editorial Team",
    bio: "A collective of physicists, engineers, and science communicators dedicated to making quantum computing accessible to everyone.",
    avatar: "/images/author-avatar.png",
    url: "https://quantumcomputinginfo.com/about",
  },

  social: {
    twitter: "https://twitter.com/quantumcompinfo",
    twitterHandle: "@quantumcompinfo",
    github: "https://github.com/quantumcomputinginfo",
    linkedin: "https://linkedin.com/company/quantumcomputinginfo",
    youtube: "https://youtube.com/@quantumcomputinginfo",
    rss: "/feed.xml",
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    cloudflareBeaconId: process.env.NEXT_PUBLIC_CF_BEACON ?? "",
  },

  giscus: {
    repo: (process.env.NEXT_PUBLIC_GISCUS_REPO ?? "PLACEHOLDER/quantumcomputinginfo") as `${string}/${string}`,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Announcements",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
    mapping: "pathname" as const,
    reactionsEnabled: true,
    emitMetadata: false,
    theme: "dark",
  },

  turnstile: {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  },
} as const;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export const navigationItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news", description: "Latest quantum computing news and announcements" },
  { label: "Tutorials", href: "/tutorials", description: "Step-by-step guides and learning resources" },
  { label: "Research", href: "/research", description: "Deep dives into cutting-edge quantum research" },
  { label: "Careers", href: "/careers", description: "Quantum computing career paths and opportunities" },
  { label: "About", href: "/about", description: "About QuantumComputingInfo and our mission" },
];

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export interface CategoryDefinition {
  slug: string;
  name: string;
  description: string;
  /** Tailwind-compatible color value (used for badges / accent borders) */
  color: string;
  /** Lucide icon name */
  iconName: string;
}

export const categories: CategoryDefinition[] = [
  {
    slug: "quantum-basics",
    name: "Quantum Basics",
    description:
      "Foundational concepts — qubits, superposition, entanglement, and the principles that make quantum computing possible.",
    color: "#8b5cf6", // violet-500
    iconName: "Atom",
  },
  {
    slug: "research",
    name: "Research",
    description:
      "In-depth analysis of the latest academic papers, breakthroughs, and experimental results in quantum computing.",
    color: "#06b6d4", // cyan-500
    iconName: "FlaskConical",
  },
  {
    slug: "news",
    name: "News",
    description:
      "Breaking news and major announcements from quantum computing companies, labs, and the wider industry.",
    color: "#f59e0b", // amber-500
    iconName: "Newspaper",
  },
  {
    slug: "tutorials",
    name: "Tutorials",
    description:
      "Hands-on guides for quantum programming, from setting up Qiskit to building your first quantum circuit.",
    color: "#10b981", // emerald-500
    iconName: "GraduationCap",
  },
  {
    slug: "careers",
    name: "Careers",
    description:
      "Career guidance, interview tips, and industry outlook for aspiring quantum computing professionals.",
    color: "#ec4899", // pink-500
    iconName: "Briefcase",
  },
];

/**
 * Quickly look up a category by slug.
 */
export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return categories.find((c) => c.slug === slug);
}
