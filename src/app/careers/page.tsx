import { getAllPosts } from "@/lib/content";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Pagination } from "@/components/blog/Pagination";

export const runtime = "edge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Quantum Computing Careers | QuantumComputingInfo",
  description: "Find career advice, skills checklists, interview tips, and job roles in the quantum computing market.",
  path: "/careers",
});

const POSTS_PER_PAGE = 9;

interface CareersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page || "1");

  const posts = await getAllPosts();
  const careerPosts = posts.filter((p) => p.category === "careers");

  const totalPosts = careerPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedCareers = careerPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const breadcrumbItems = [{ label: "Careers", href: "/careers" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quantum Computing Careers</h1>
          <p className="mt-2 text-muted-foreground">
            Learn what skills you need, what roles exist (from scientist to software developer), and how to land a job in quantum.
          </p>
        </div>

        {paginatedCareers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedCareers.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/careers"
              />
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No career articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
