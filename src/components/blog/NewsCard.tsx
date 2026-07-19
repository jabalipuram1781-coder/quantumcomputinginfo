import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { SourceBadge } from "./SourceBadge";

import type { Article } from "@/lib/content";

interface NewsCardProps {
  article: Article;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NewsCard({ article }: NewsCardProps) {
  const href = article.sourceUrl || `/blog/${article.slug}`;
  const isExternal = !!article.sourceUrl;

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-border/80 hover:bg-accent/40">
      {/* Source Badge */}
      {article.source && (
        <SourceBadge source={article.source} sourceName={article.sourceName} />
      )}

      {/* Title */}
      <div className="min-w-0 flex-1">
        {isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-violet-500 dark:group-hover:text-violet-400"
          >
            {article.title}
          </a>
        ) : (
          <Link
            href={href}
            className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-violet-500 dark:group-hover:text-violet-400"
          >
            {article.title}
          </Link>
        )}
      </div>

      {/* Date */}
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="size-3" />
        {formatDate(article.publishDate)}
      </span>

      {/* External indicator */}
      {isExternal && (
        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-violet-500 dark:group-hover:text-violet-400" />
      )}
    </div>
  );
}
