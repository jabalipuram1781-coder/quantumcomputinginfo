import { getAllPosts } from "@/lib/content";
import { categories, getCategoryBySlug } from "@/lib/constants";
import { ArticleCard } from "@/components/blog/ArticleCard";

export const runtime = "edge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata as siteGenerateMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const catObj = getCategoryBySlug(resolvedParams.category);
  if (!catObj) return {};

  return siteGenerateMetadata({
    title: `${catObj.name} | QuantumComputingInfo`,
    description: catObj.description,
    path: `/categories/${resolvedParams.category}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const catObj = getCategoryBySlug(resolvedParams.category);

  if (!catObj) {
    notFound();
  }

  const posts = await getAllPosts();
  const categoryPosts = posts.filter((p) => p.category === resolvedParams.category);

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: catObj.name, href: `/categories/${resolvedParams.category}` },
  ];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{catObj.name}</h1>
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: catObj.color }}
            />
          </div>
          <p className="mt-2 text-muted-foreground">{catObj.description}</p>
        </div>

        {categoryPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryPosts.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
