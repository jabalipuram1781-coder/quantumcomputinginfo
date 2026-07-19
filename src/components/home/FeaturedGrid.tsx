import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article } from "@/lib/content";

interface FeaturedGridProps {
  articles: Article[];
}

export function FeaturedGrid({ articles }: FeaturedGridProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-violet-500/20 to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
