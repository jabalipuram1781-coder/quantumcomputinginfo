import { getAllPosts } from "@/lib/content";
import { NewsCard } from "@/components/blog/NewsCard";
import { Pagination } from "@/components/blog/Pagination";

export const runtime = "edge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Quantum Computing News | QuantumComputingInfo",
  description: "Stay up to date with the latest news, announcements, and events in the quantum computing industry.",
  path: "/news",
});

const POSTS_PER_PAGE = 12;

interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page || "1");

  const posts = await getAllPosts();
  const newsPosts = posts.filter((p) => p.category === "news");

  const totalPosts = newsPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedNews = newsPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const breadcrumbItems = [{ label: "News", href: "/news" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quantum Computing News</h1>
          <p className="mt-2 text-muted-foreground">
            Latest industry updates, processor announcements, and market shifts from IBM, Google, Rigetti, and other global quantum leaders.
          </p>
        </div>

        {paginatedNews.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedNews.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/news"
              />
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No news articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
