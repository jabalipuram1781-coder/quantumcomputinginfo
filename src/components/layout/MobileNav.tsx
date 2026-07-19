"use client";

import Link from "next/link";
import {
  BookOpen,
  Newspaper,
  Layers,
  Info,
  Mail,
  Rss,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const navItems = [
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Categories", href: "/categories", icon: Layers },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

const categories = [
  { slug: "quantum-basics", name: "Quantum Basics" },
  { slug: "research", name: "Research" },
  { slug: "news", name: "News" },
  { slug: "tutorials", name: "Tutorials" },
  { slug: "careers", name: "Careers" },
];

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
  { label: "GitHub", href: "https://github.com", icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "RSS Feed", href: "/rss.xml", icon: Rss },
];

interface MobileNavProps {
  onNavigate?: () => void;
}

export function MobileNav({ onNavigate }: MobileNavProps) {
  return (
    <div className="flex flex-col gap-6 px-4 py-2">
      {/* Main Navigation */}
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Icon className="size-4 text-violet-400" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <Separator className="bg-white/10" />

      {/* Categories */}
      <div>
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Categories
        </p>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              onClick={onNavigate}
              className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Social Links */}
      <div>
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Connect
        </p>
        <div className="flex items-center gap-2 px-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Icon className="size-4" />
                <span className="sr-only">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
