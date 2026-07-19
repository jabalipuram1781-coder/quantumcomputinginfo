import * as React from "react";
import { GlossaryList } from "@/components/blog/GlossaryList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";
import { BookOpen } from "lucide-react";

export const metadata = generateMetadata({
  title: "Quantum Jargon Glossary | QuantumComputingInfo",
  description: "A comprehensive dictionary and glossary of quantum computing terms, definitions, and concepts.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const breadcrumbItems = [{ label: "Glossary", href: "/glossary" }];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
            <div className="mx-auto sm:mx-0 flex size-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quantum Jargon Glossary</h1>
              <p className="mt-2 text-white/50">
                Clear explanations of core quantum principles, hardware components, software tools, and milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Search & List */}
        <GlossaryList />
      </div>
    </div>
  );
}
