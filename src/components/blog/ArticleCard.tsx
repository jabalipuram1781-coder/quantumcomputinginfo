import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import { SourceBadge } from "./SourceBadge";
import { ArticleCover } from "./ArticleCover";

import type { Article } from "@/lib/content";

interface ArticleCardProps {
  article: Article;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="group/card overflow-hidden border-0 bg-white/[0.02] ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 hover:ring-white/10">
      {/* Article Cover Image */}
      <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/9] overflow-hidden">
        <ArticleCover category={article.category} title={article.title} />
        <div className="absolute bottom-3 left-3 z-20">
          <CategoryBadge category={article.category} noLink={true} />
        </div>
      </Link>

      <CardContent className="space-y-3 p-4">
        {/* Title */}
        <Link href={`/blog/${article.slug}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover/card:text-violet-400">
            {article.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(article.publishDate)}
            </span>
            {article.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {article.readingTime} min
              </span>
            )}
          </div>
          {article.source && (
            <SourceBadge source={article.source} sourceName={article.sourceName} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
