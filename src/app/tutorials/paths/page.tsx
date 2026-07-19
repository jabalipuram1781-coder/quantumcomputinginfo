import * as React from "react";
import { generateMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PathsDashboard } from "@/components/blog/PathsDashboard";
import { Compass } from "lucide-react";

export const metadata = generateMetadata({
  title: "Quantum Learning Paths | QuantumComputingInfo",
  description: "Structured self-paced learning roadmaps for quantum computing, from basics to programming simulators.",
  path: "/tutorials/paths",
});

export default function LearningPathsPage() {
  const breadcrumbItems = [
    { label: "Tutorials", href: "/tutorials" },
    { label: "Learning Paths", href: "/tutorials/paths" }
  ];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
            <div className="mx-auto sm:mx-0 flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Compass className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quantum Learning Paths</h1>
              <p className="mt-2 text-muted-foreground">
                Follow our structured roadmaps to master quantum mechanics, algorithms, and practical quantum programming.
              </p>
            </div>
          </div>
        </div>

        {/* Client Interactive Dashboard */}
        <PathsDashboard />
      </div>
    </div>
  );
}
