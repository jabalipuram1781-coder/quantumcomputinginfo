"use client";

import * as React from "react";
import { Check, X, HelpCircle, RefreshCw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizWidgetProps {
  id: string;
  question: string;
  options: string[] | QuizOption[]; // support both string arrays and detailed objects
  correctIndex?: number; // only needed if options is a string array
  explanation?: string;
  title?: string;
}

export function QuizWidget({
  id,
  question,
  options,
  correctIndex,
  explanation,
  title = "Concept Check"
}: QuizWidgetProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);

  // Normalize options into QuizOption objects
  const normalizedOptions: QuizOption[] = React.useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    return options.map((opt, index) => {
      if (typeof opt === "string") {
        return {
          text: opt,
          isCorrect: index === (correctIndex ?? 0),
        };
      }
      return opt;
    });
  }, [options, correctIndex]);

  // Load progress from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(`quiz_completed_${id}`);
    if (saved) {
      const idx = Number(saved);
      setSelected(idx);
      setSubmitted(true);
      setCompleted(true);
    }
  }, [id]);

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    setCompleted(true);
    localStorage.setItem(`quiz_completed_${id}`, String(selected));
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
    setCompleted(false);
    localStorage.removeItem(`quiz_completed_${id}`);
  };

  const isUserCorrect = selected !== null && normalizedOptions[selected]?.isCorrect;

  return (
    <div className="my-8 rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute right-0 top-0 -z-10 size-40 rounded-full bg-cyan-500/5 opacity-50 blur-2xl transition-all duration-500" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <HelpCircle className="size-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
        </div>
        {completed && (
          <span className={cn(
            "flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border",
            isUserCorrect 
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
              : "border-red-500/30 bg-red-500/10 text-red-500 dark:text-red-400"
          )}>
            {isUserCorrect ? <Trophy className="size-3" /> : null}
            {isUserCorrect ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      {/* Question */}
      <h4 className="text-base font-bold text-foreground mb-4 leading-snug">
        {question}
      </h4>

      {/* Options List */}
      <div className="space-y-2">
        {normalizedOptions.map((option, index) => {
          const isSelected = selected === index;
          const isCorrectAnswer = option.isCorrect;
          
          let optionStyle = "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-accent";
          
          if (isSelected && !submitted) {
            optionStyle = "border-violet-500 bg-violet-500/5 text-violet-650 dark:text-violet-400";
          } else if (submitted) {
            if (isCorrectAnswer) {
              optionStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = "border-red-500/50 bg-red-500/10 text-red-550 dark:text-red-400";
            } else {
              optionStyle = "border-border bg-muted/40 text-muted-foreground/45 pointer-events-none";
            }
          }

          return (
            <button
              key={index}
              disabled={submitted}
              onClick={() => handleSelect(index)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-all duration-200 cursor-pointer",
                optionStyle
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                  isSelected && !submitted ? "border-violet-400 text-violet-500 dark:text-violet-400" : "border-border text-muted-foreground"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option.text}</span>
              </span>

              {submitted && isCorrectAnswer && (
                <Check className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
              )}
              {submitted && isSelected && !isCorrectAnswer && (
                <X className="size-4 shrink-0 text-red-500 dark:text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit / Reset Panel */}
      <div className="mt-6 flex flex-col gap-4">
        {!submitted ? (
          <button
            disabled={selected === null}
            onClick={handleSubmit}
            className={cn(
              "w-full rounded-xl py-3 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300",
              selected !== null
                ? "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-purple-500/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                : "bg-muted border border-border text-muted-foreground/30 cursor-not-allowed"
            )}
          >
            Check Answer
          </button>
        ) : (
          <div className="space-y-4 border-t border-border pt-4">
            {explanation && (
              <div className="rounded-xl bg-muted/30 border border-border p-4 text-xs leading-relaxed text-muted-foreground">
                <strong className="block text-foreground mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Explanation:
                </strong>
                {explanation}
              </div>
            )}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline mx-auto"
            >
              <RefreshCw className="size-3" />
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
