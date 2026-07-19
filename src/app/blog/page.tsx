import { getAllPosts, getPostsByCategory } from "@/lib/content";
import { categories } from "@/lib/constants";
import { ArticleCard } from "@/components/blog/ArticleCard";

export const runtime = "edge";
import { Pagination } from "@/components/blog/Pagination";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Blog | QuantumComputingInfo",
  description: "Browse all articles, news, tutorials, and research breakthroughs on QuantumComputingInfo.",
  path: "/blog",
});

const POSTS_PER_PAGE = 9;

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page || "1");
  const selectedCategory = resolvedParams.category || "";
  const selectedTag = resolvedParams.tag || "";

  let posts = await getAllPosts();

  // Filter by category if selected
  if (selectedCategory) {
    posts = posts.filter((p) => p.category === selectedCategory);
  }

  // Filter by tag if selected
  if (selectedTag) {
    posts = posts.filter((p) => p.tags.includes(selectedTag));
  }

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Paginate posts
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Set up breadcrumbs path
  const breadcrumbItems = [{ label: "Blog", href: "/blog" }];
  if (selectedCategory) {
    const catObj = categories.find((c) => c.slug === selectedCategory);
    breadcrumbItems.push({
      label: catObj ? catObj.name : selectedCategory,
      href: `/blog?category=${selectedCategory}`,
    });
  }
  if (selectedTag) {
    breadcrumbItems.push({
      label: `Tag: ${selectedTag}`,
      href: `/blog?tag=${selectedTag}`,
    });
  }

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name
              : selectedTag
              ? `Articles Tagged "${selectedTag}"`
              : "All Articles"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.description
              : "Deep dive into the latest in quantum computing, from basics to career pathways."}
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap gap-2 border-b border-border pb-6">
          <Link href="/blog">
            <span
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                !selectedCategory
                  ? "bg-violet-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              All Categories
            </span>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/blog?category=${cat.slug}`}>
              <span
                className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-violet-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                style={{
                  borderLeft: selectedCategory === cat.slug ? `2px solid ${cat.color}` : "none",
                }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Article Grid */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={
                  selectedCategory
                    ? `/blog?category=${selectedCategory}`
                    : selectedTag
                    ? `/blog?tag=${selectedTag}`
                    : "/blog"
                }
              />
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No articles found matching the criteria.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-sm font-medium text-violet-500 dark:text-violet-400 hover:underline"
            >
              Clear filters and view all
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
