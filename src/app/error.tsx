"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] text-white px-4 text-center">
      {/* Glow */}
      <div className="absolute size-96 rounded-full bg-red-500/5 blur-[120px]" />

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="mx-auto inline-flex rounded-full bg-red-500/10 p-4 text-red-400">
          <AlertCircle className="size-12" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">System Fault</h1>
        <h2 className="text-lg font-semibold text-white/80">Quantum State Error</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          An unexpected error occurred during quantum state transition. The system was unable to complete the execution.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => reset()}
            className="gap-2 bg-violet-600 px-6 text-white hover:bg-violet-500"
          >
            <RefreshCw className="size-4" />
            Reset State
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-white/10 bg-white/[0.02] text-white hover:bg-white/5"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
