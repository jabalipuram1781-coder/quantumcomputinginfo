"use client";

import * as React from "react";
import { Link2, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      label: "Twitter",
      icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      hoverColor: "hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/20",
    },
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      hoverColor: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20",
    },
    {
      label: "Reddit",
      icon: MessageCircle,
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      hoverColor: "hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/20",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.label}`}
          >
            <Button
              variant="outline"
              size="icon-sm"
              className={`border-border bg-card text-muted-foreground ${link.hoverColor}`}
            >
              <Icon className="size-3.5" />
            </Button>
          </a>
        );
      })}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={copyLink}
        className="border-border bg-card text-muted-foreground hover:border-violet-500/20 hover:bg-violet-500/10 hover:text-violet-500 dark:hover:text-violet-400"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-400" />
        ) : (
          <Link2 className="size-3.5" />
        )}
      </Button>
      {copied && (
        <span className="text-xs text-emerald-400">Copied!</span>
      )}
    </div>
  );
}
