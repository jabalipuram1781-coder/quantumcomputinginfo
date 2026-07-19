import { getAllPosts } from "@/lib/content";
import { SearchClient } from "./SearchClient";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Search Articles | QuantumComputingInfo",
  description: "Search all articles, news, tutorials, and research summaries on QuantumComputingInfo.",
  path: "/search",
});

export default async function SearchPage() {
  const posts = await getAllPosts();
  const breadcrumbItems = [{ label: "Search", href: "/search" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Search Articles</h1>
          <p className="mt-2 text-white/50">
            Fuzzy search across titles, descriptions, tags, and categories.
          </p>
        </div>

        <SearchClient initialArticles={posts} />
      </div>
    </div>
  );
}
