import { FileText, Layers, RefreshCw } from "lucide-react";

interface StatsBarProps {
  articleCount: number;
  categoryCount: number;
}

export function StatsBar({ articleCount, categoryCount }: StatsBarProps) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 backdrop-blur-sm sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <FileText className="size-4 text-violet-400" />
            <span className="font-semibold text-white">{articleCount}</span>
            Articles
          </div>

          <div className="hidden h-4 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-2 text-sm text-white/60">
            <Layers className="size-4 text-cyan-400" />
            <span className="font-semibold text-white">{categoryCount}</span>
            Categories
          </div>

          <div className="hidden h-4 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-2 text-sm text-white/60">
            <RefreshCw className="size-4 text-emerald-400" />
            Updated Daily
          </div>
        </div>
      </div>
    </section>
  );
}
