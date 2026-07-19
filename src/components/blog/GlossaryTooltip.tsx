"use client";

import * as React from "react";
import { getGlossaryEntry } from "@/lib/glossary";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const entry = getGlossaryEntry(term);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLSpanElement>(null);
  const [position, setPosition] = React.useState<"top" | "bottom">("top");

  React.useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      if (triggerRect.top - tooltipHeight < 80) {
        setPosition("bottom");
      } else {
        setPosition("top");
      }
    }
  }, [isOpen]);

  if (!entry) {
    return <span>{children || term}</span>;
  }

  const categoryColors: Record<string, string> = {
    theory: "border-violet-500/30 text-violet-400 bg-violet-500/10",
    hardware: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    software: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    industry: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  };

  return (
    <span
      ref={triggerRef}
      className="relative inline-block cursor-help border-b border-dashed border-violet-400/60 text-violet-400 transition-colors hover:text-violet-300"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
    >
      {children || entry.term}

      {/* Tooltip Card */}
      <span
        ref={tooltipRef}
        className={cn(
          "absolute left-1/2 z-50 w-72 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 p-4 text-left text-sm font-normal normal-case leading-relaxed text-white shadow-2xl shadow-purple-500/10 backdrop-blur-xl transition-all duration-300",
          isOpen
            ? "visible opacity-100 scale-100"
            : "invisible opacity-0 scale-95 pointer-events-none",
          position === "top"
            ? "bottom-full mb-3"
            : "top-full mt-3"
        )}
      >
        <span className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <BookOpen className="size-3.5 text-violet-400" />
            {entry.term}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              categoryColors[entry.category] || "border-white/10 text-white/60 bg-white/5"
            )}
          >
            {entry.category}
          </span>
        </span>
        <span className="block text-xs text-white/70">
          {entry.definition}
        </span>
        <span className="mt-2.5 flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-white/5 px-1 py-0.5 text-[10px] text-white/40"
            >
              #{tag}
            </span>
          ))}
        </span>
        {/* Glow ring */}
        <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 opacity-50 blur-sm" />
      </span>
    </span>
  );
}
