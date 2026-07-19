import { getAllPosts } from "@/lib/content";
import { categories } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowRight, Atom, FlaskConical, Newspaper, GraduationCap, Briefcase, Layers } from "lucide-react";

export const metadata = generateMetadata({
  title: "Categories | QuantumComputingInfo",
  description: "Browse all quantum computing categories including basics, research, news, tutorials, and career guides.",
  path: "/categories",
});

// Map icon names to Lucide icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Atom,
  FlaskConical,
  Newspaper,
  GraduationCap,
  Briefcase,
};

export default async function CategoriesIndexPage() {
  const posts = await getAllPosts();
  const breadcrumbItems = [{ label: "Categories", href: "/categories" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-12 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
            <div className="mx-auto sm:mx-0 flex size-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Layers className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore by Category</h1>
              <p className="mt-2 text-muted-foreground">
                Navigate our curated resource libraries across the main dimensions of quantum computing.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.iconName] || Atom;
            const articleCount = posts.filter((p) => p.category === cat.slug).length;

            return (
              <div
                key={cat.slug}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border hover:bg-accent/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent border stripe at the top */}
                <div
                  className="absolute top-0 inset-x-0 h-1"
                  style={{ backgroundColor: cat.color }}
                />

                <div className="space-y-4">
                  {/* Icon & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: `${cat.color}0a`,
                        borderColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                      {articleCount} {articleCount === 1 ? "Article" : "Articles"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer group/link"
                  >
                    Explore Resources
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
