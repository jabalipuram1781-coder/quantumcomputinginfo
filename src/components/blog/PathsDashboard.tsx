"use client";

import * as React from "react";
import { learningPaths, LearningPath, LearningPathMilestone } from "@/lib/learning-paths";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Award, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export function PathsDashboard() {
  const [completedMilestones, setCompletedMilestones] = React.useState<Record<string, boolean>>({});

  // Load progress from localStorage on mount
  React.useEffect(() => {
    const loaded: Record<string, boolean> = {};
    learningPaths.forEach((path) => {
      path.milestones.forEach((ms) => {
        const val = localStorage.getItem(`milestone_completed_${ms.id}`);
        if (val === "true") {
          loaded[ms.id] = true;
        }
      });
    });
    setCompletedMilestones(loaded);
  }, []);

  const toggleMilestone = (id: string) => {
    const nextState = !completedMilestones[id];
    const newCompleted = { ...completedMilestones, [id]: nextState };
    setCompletedMilestones(newCompleted);
    localStorage.setItem(`milestone_completed_${id}`, String(nextState));
  };

  const getPathProgress = (path: LearningPath) => {
    const total = path.milestones.length;
    const completedCount = path.milestones.filter((ms) => completedMilestones[ms.id]).length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return { completedCount, total, percentage };
  };

  const difficultyColors: Record<string, string> = {
    beginner: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
    intermediate: "border-cyan-500/20 text-cyan-400 bg-cyan-500/5",
    advanced: "border-violet-500/20 text-violet-400 bg-violet-500/5",
  };

  return (
    <div className="space-y-12">
      {learningPaths.map((path) => {
        const { completedCount, total, percentage } = getPathProgress(path);
        const isPathComplete = completedCount === total;

        return (
          <div
            key={path.id}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Background glowing rings */}
            <div
              className={cn(
                "absolute -right-20 -top-20 -z-10 size-60 rounded-full opacity-5 blur-3xl transition-all duration-500",
                path.difficulty === "beginner" ? "bg-emerald-500" : path.difficulty === "intermediate" ? "bg-cyan-500" : "bg-violet-500"
              )}
            />

            {/* Path Info Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8 pb-6 border-b border-border">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      difficultyColors[path.difficulty]
                    )}
                  >
                    {path.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {path.estimatedHours} hours est.
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{path.title}</h2>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{path.description}</p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="flex items-center gap-4 shrink-0 sm:text-right">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</div>
                  <div className="text-sm font-bold text-foreground">
                    {completedCount} / {total} Completed
                  </div>
                </div>
                <div className="relative size-12 shrink-0 rounded-full border border-border flex items-center justify-center font-bold text-sm bg-muted text-foreground">
                  {percentage}%
                  {isPathComplete && (
                    <Award className="absolute -right-1 -top-1 size-5 text-amber-400 bg-background rounded-full p-0.5" />
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Layout of Milestones */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {path.milestones.map((milestone, idx) => {
                const isCompleted = !!completedMilestones[milestone.id];
                
                return (
                  <div key={milestone.id} className="relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 group">
                    
                    {/* Checkbox Node */}
                    <button
                      onClick={() => toggleMilestone(milestone.id)}
                      className="absolute -left-[27px] sm:-left-[31px] top-1 z-10 flex size-6 items-center justify-center rounded-full bg-background transition-transform duration-200 hover:scale-110 cursor-pointer"
                      aria-label={isCompleted ? "Mark milestone incomplete" : "Mark milestone complete"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-5 text-cyan-500 dark:text-cyan-400" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground/30 hover:text-muted-foreground/60" />
                      )}
                    </button>

                    {/* Milestone Card Content */}
                    <div className="flex-1 rounded-xl border border-border bg-card p-5 transition-all duration-300 group-hover:border-border/80 group-hover:bg-accent/40">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center gap-2">
                            <span className="text-muted-foreground/40 text-xs font-mono">0{idx + 1}.</span>
                            {milestone.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                            {milestone.description}
                          </p>
                        </div>

                        {/* Actions / Status */}
                        <div className="flex items-center gap-3 mt-2 sm:mt-0 shrink-0">
                          <span className="text-[10px] text-muted-foreground/60 font-medium">
                            {milestone.estimatedMinutes} min
                          </span>
                          
                          {milestone.slug ? (
                            <Link
                              href={`/blog/${milestone.slug}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 transition-colors uppercase tracking-wider"
                            >
                              <BookOpen className="size-3" />
                              Start
                              <ChevronRight className="size-2.5" />
                            </Link>
                          ) : (
                            <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
