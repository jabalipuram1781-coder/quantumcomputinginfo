"use client";

import * as React from "react";
import Link from "next/link";
import { Atom, Rss, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const categories = [
  { slug: "quantum-basics", name: "Quantum Basics" },
  { slug: "research", name: "Research" },
  { slug: "news", name: "News" },
  { slug: "tutorials", name: "Tutorials" },
  { slug: "careers", name: "Careers" },
];

const resources = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Jargon Glossary", href: "/glossary" },
  { label: "Learning Paths", href: "/tutorials/paths" },
  { label: "RSS Feed", href: "/feed.xml" },
];

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
  { label: "GitHub", href: "https://github.com", icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "RSS", href: "/feed.xml", icon: Rss },
];

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Atom className="size-5 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent">
                QuantumComputingInfo
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              Your comprehensive resource for quantum computing news, research
              breakthroughs, tutorials, and career opportunities in the quantum
              technology space.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-violet-400"
                    aria-label={link.label}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Get weekly updates on quantum computing delivered to your inbox.
              </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 border-border bg-card text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="shrink-0 bg-violet-600 text-white hover:bg-violet-500"
              >
                <Send className="size-4" />
              </Button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-xs text-emerald-400">Subscribed successfully!</p>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">Something went wrong. Try again.</p>
            )}
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} QuantumComputingInfo.com. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js • Powered by quantum curiosity
          </p>
        </div>
      </div>
    </footer>
  );
}
