import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: "original" | "aggregated";
  sourceName?: string;
  className?: string;
}

export function SourceBadge({ source, sourceName, className }: SourceBadgeProps) {
  if (source === "original") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400",
          className
        )}
      >
        <Check className="size-3" />
        Original
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <ExternalLink className="size-3" />
      via {sourceName || "External"}
    </span>
  );
}
