import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function TagCloud({ tags, onTagClick, className }: TagCloudProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        if (onTagClick) {
          return (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
            >
              {tag}
            </button>
          );
        }

        return (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
}
