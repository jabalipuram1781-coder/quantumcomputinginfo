import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-28 lg:py-36">
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Circuit-like lines */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(139,92,246,0.04)_49%,rgba(139,92,246,0.04)_51%,transparent_52%)] bg-[size:60px_60px]" />

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 size-64 animate-pulse rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="absolute right-1/4 bottom-1/4 size-48 animate-pulse rounded-full bg-cyan-500/10 blur-[80px] [animation-delay:1s]" />
      <div className="absolute top-1/2 left-1/2 size-32 animate-pulse rounded-full bg-purple-500/10 blur-[60px] [animation-delay:2s]" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Accent badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-violet-500" />
          </span>
          Exploring the Quantum Frontier
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-white">Quantum Computing </span>
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            News, Research
          </span>
          <br />
          <span className="text-white">&amp; </span>
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Learning Hub
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
          Stay ahead of the quantum revolution. Discover the latest breakthroughs,
          learn fundamental concepts, and explore career opportunities in quantum
          computing and quantum information science.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/blog">
            <Button
              size="lg"
              className="gap-2 bg-violet-600 px-6 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500"
            >
              Read Articles
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/news">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/10 bg-white/[0.02] px-6 text-white/80 hover:bg-white/5 hover:text-white"
            >
              <Newspaper className="size-4" />
              Latest News
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
