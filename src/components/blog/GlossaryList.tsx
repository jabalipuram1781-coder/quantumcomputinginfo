"use client";

import * as React from "react";
import { glossaryEntries, GlossaryEntry } from "@/lib/glossary";
import { Search, BookOpen, Code, Cpu, GraduationCap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlossaryList() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const filteredEntries = glossaryEntries.filter((entry) => {
    const matchesSearch =
      entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || entry.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { slug: "all", label: "All Terms", icon: BookOpen },
    { slug: "theory", label: "Theory & Principles", icon: GraduationCap },
    { slug: "hardware", label: "Hardware & Physics", icon: Cpu },
    { slug: "software", label: "Software & Dev", icon: Code },
    { slug: "industry", label: "Industry & Milestones", icon: Building2 },
  ];

  const categoryBadgeColors: Record<string, string> = {
    theory: "border-violet-500/20 text-violet-400 bg-violet-500/5",
    hardware: "border-cyan-500/20 text-cyan-400 bg-cyan-500/5",
    software: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
    industry: "border-amber-500/20 text-amber-400 bg-amber-500/5",
  };

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search jargon, definitions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-white/5 bg-white/[0.02] text-white/60 hover:border-white/10 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="size-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Glossary Cards */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => {
            return (
              <div
                key={entry.term}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.01] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.02] hover:shadow-purple-500/5"
              >
                {/* Glowing border ring */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white transition-colors group-hover:text-violet-300">
                    {entry.term}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      categoryBadgeColors[entry.category]
                    )}
                  >
                    {entry.category}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed text-white/60 min-h-[80px]">
                  {entry.definition}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/5 py-16 text-center">
          <BookOpen className="mx-auto size-8 text-white/20 mb-3" />
          <p className="text-white/40 text-sm">No terms match your search filters.</p>
        </div>
      )}
    </div>
  );
}
