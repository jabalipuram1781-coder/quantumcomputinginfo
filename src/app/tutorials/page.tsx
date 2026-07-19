import { getAllPosts } from "@/lib/content";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Pagination } from "@/components/blog/Pagination";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata = generateMetadata({
  title: "Quantum Computing Tutorials | QuantumComputingInfo",
  description: "Learn quantum programming and quantum physics with step-by-step programming guides and tutorials.",
  path: "/tutorials",
});

const POSTS_PER_PAGE = 9;

interface TutorialsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TutorialsPage({ searchParams }: TutorialsPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page || "1");

  const posts = await getAllPosts();
  const tutorialPosts = posts.filter((p) => p.category === "tutorials");

  const totalPosts = tutorialPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedTutorials = tutorialPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const breadcrumbItems = [{ label: "Tutorials", href: "/tutorials" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quantum Computing Tutorials</h1>
          <p className="mt-2 text-muted-foreground">
            Hands-on guides and programming tutorials covering Qiskit, quantum circuit design, algorithms, and simulation.
          </p>
        </div>

        {/* Learning Paths CTA Banner */}
        <div className="mb-10 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 dark:from-cyan-950/40 dark:to-violet-950/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
              <Sparkles className="size-3 animate-pulse" />
              Structured Curriculum
            </div>
            <h2 className="text-xl font-bold text-foreground">Interactive Learning Paths</h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Prefer a structured roadmap? Follow our guided tracks with step-by-step milestones, progress tracking, and interactive quizzes to test your knowledge.
            </p>
          </div>
          <Link
            href="/tutorials/paths"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
          >
            Explore Paths
            <ArrowRight className="size-3.5" />
          </Link>
          <div className="absolute right-0 top-0 -z-10 size-40 bg-cyan-500/5 blur-2xl pointer-events-none" />
        </div>

        {paginatedTutorials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedTutorials.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/tutorials"
              />
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No tutorials found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
