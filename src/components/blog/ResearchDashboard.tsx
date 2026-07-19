"use client";

import * as React from "react";
import { Article } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchDashboardProps {
  posts: Article[];
}

export function ResearchDashboard({ posts }: ResearchDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"newest" | "oldest">("newest");
  const [selectedSource, setSelectedSource] = React.useState<string>("all");

  // Extract all unique tags from research posts
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Extract all unique sources
  const allSources = React.useMemo(() => {
    const sourcesSet = new Set<string>();
    posts.forEach((post) => {
      if (post.sourceName) sourcesSet.add(post.sourceName);
    });
    return Array.from(sourcesSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let result = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);

      const matchesSource =
        selectedSource === "all" || post.sourceName === selectedSource;

      return matchesSearch && matchesTag && matchesSource;
    });

    result.sort((a, b) => {
      const timeA = new Date(a.publishDate).getTime();
      const timeB = new Date(b.publishDate).getTime();
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [posts, searchQuery, selectedTag, sortBy, selectedSource]);

  return (
    <div className="space-y-8">
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search research titles or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          {/* Source filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-[#0a0a0f] py-2.5 pl-10 pr-4 text-sm text-white/70 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Sources</option>
              {allSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="w-full rounded-xl border border-white/5 bg-[#0a0a0f] py-2.5 pl-10 pr-4 text-sm text-white/70 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 appearance-none cursor-pointer"
            >
              <option value="newest">Sort by Date: Newest</option>
              <option value="oldest">Sort by Date: Oldest</option>
            </select>
          </div>
        </div>

        {/* Tag pills list */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            <button
              onClick={() => setSelectedTag("all")}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer",
                selectedTag === "all"
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-white/50 hover:border-white/10 hover:text-white"
              )}
            >
              #all
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer",
                  selectedTag === tag
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-white/5 bg-white/[0.02] text-white/50 hover:border-white/10 hover:text-white"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedPosts.map((post) => (
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl border border-dashed border-white/5">
          <p className="text-lg text-white/40">No research articles match your filters.</p>
        </div>
      )}
    </div>
  );
}
