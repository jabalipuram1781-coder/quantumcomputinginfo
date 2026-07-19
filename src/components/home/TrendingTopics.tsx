import { TagCloud } from "@/components/blog/TagCloud";

const trendingTags = [
  "Quantum AI",
  "Qubits",
  "Error Correction",
  "Quantum Security",
  "Post-Quantum Cryptography",
  "Quantum Hardware",
  "Quantum Algorithms",
  "Quantum Supremacy",
];

export function TrendingTopics() {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Trending Topics</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent" />
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
          <TagCloud tags={trendingTags} />
        </div>
      </div>
    </section>
  );
}
