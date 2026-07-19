import Link from "next/link";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { name: string; color: string }> = {
  "quantum-basics": {
    name: "Quantum Basics",
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
  },
  research: {
    name: "Research",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  },
  news: {
    name: "News",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  tutorials: {
    name: "Tutorials",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  },
  careers: {
    name: "Careers",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
  },
};

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  noLink?: boolean;
}

export function CategoryBadge({ category, size = "sm", noLink = false }: CategoryBadgeProps) {
  const config = categoryConfig[category] ?? {
    name: category,
    color: "bg-white/5 text-white/60 border-white/10 hover:bg-white/10",
  };

  const badgeClass = cn(
    "inline-flex items-center rounded-full border font-medium transition-colors",
    config.color,
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
  );

  if (noLink) {
    return (
      <span className={badgeClass}>
        {config.name}
      </span>
    );
  }

  return (
    <Link href={`/categories/${category}`} className={badgeClass}>
      {config.name}
    </Link>
  );
}
