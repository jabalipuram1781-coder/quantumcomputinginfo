"use client";

import * as React from "react";
import { Sparkles, Brain, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleSummarizerProps {
  title: string;
  content: string;
}

export function ArticleSummarizer({ title, content }: ArticleSummarizerProps) {
  const [summary, setSummary] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message || "An error occurred while generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden group">
      {/* Background radial glow */}
      <div className="absolute right-0 top-0 -z-10 size-40 rounded-full bg-violet-500/5 opacity-50 blur-2xl transition-all duration-500 group-hover:bg-violet-500/10" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Brain className="size-3.5" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              AI Insights
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            Get a 3-second summary of this article
          </h3>
        </div>

        {!summary && !loading && (
          <button
            onClick={handleSummarize}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="size-3.5 animate-pulse" />
            Summarize with AI
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 text-cyan-500 dark:text-cyan-400 animate-spin" />
          <span className="animate-pulse">Consulting Gemini to distill key takeaways...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 border-t border-border">
          {error}
        </div>
      )}

      {/* Summary Bullet Points */}
      {summary && (
        <div className="mt-6 border-t border-border pt-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-violet-500 dark:text-violet-400 uppercase tracking-wider">
              Gemini Distilled Takeaways:
            </span>
            <button
              onClick={() => setSummary(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline cursor-pointer"
            >
              Clear Summary
            </button>
          </div>
          <ul className="space-y-3">
            {summary.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 flex size-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-md shadow-violet-500/50" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
