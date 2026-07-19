import { getAllPosts } from "@/lib/content";
import { ResearchDashboard } from "@/components/blog/ResearchDashboard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";
import { FlaskConical } from "lucide-react";

export const metadata = generateMetadata({
  title: "Quantum Research Breakdowns | QuantumComputingInfo",
  description: "Stay ahead of cutting-edge quantum research. Clear summaries of latest academic publications and preprints.",
  path: "/research",
});

export default async function ResearchPage() {
  const posts = await getAllPosts();
  const researchPosts = posts.filter((p) => p.category === "research");

  const breadcrumbItems = [{ label: "Research", href: "/research" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
            <div className="mx-auto sm:mx-0 flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FlaskConical className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quantum Computing Research</h1>
              <p className="mt-2 text-white/50">
                Plain-English summaries and deep dives into scientific breakthroughs, quantum supremacy claims, and new theoretical papers.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Research Dashboard */}
        <ResearchDashboard posts={researchPosts} />
      </div>
    </div>
  );
}
