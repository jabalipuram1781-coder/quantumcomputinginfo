import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  // Generate page numbers to show
  const pages: (number | "ellipsis")[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)}>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-1 border-border/40 text-muted-foreground/30"
        >
          <ChevronLeft className="size-3.5" />
          Previous
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground/40">
                …
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Link key={page} href={getPageUrl(page)}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="icon-sm"
                className={cn(
                  isActive
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {page}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)}>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-border bg-card text-muted-foreground hover:text-foreground"
          >
            Next
            <ChevronRight className="size-3.5" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-1 border-border/40 text-muted-foreground/30"
        >
          Next
          <ChevronRight className="size-3.5" />
        </Button>
      )}
    </nav>
  );
}
