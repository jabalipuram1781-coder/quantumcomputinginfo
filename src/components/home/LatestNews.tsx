import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/components/blog/NewsCard";
import type { Article } from "@/lib/content";

interface LatestNewsProps {
  articles: Article[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Latest News</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
        </div>
        <div className="space-y-2">
          {articles.slice(0, 10).map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            View All News
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
