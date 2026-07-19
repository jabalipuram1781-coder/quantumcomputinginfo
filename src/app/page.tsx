import Link from "next/link";
import { ArrowRight, Terminal, Sparkles, Cpu, Award } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "QuantumComputingInfo | Exploring the Quantum Frontier",
  description: "Your premier destination for quantum computing news, tutorials, research breakdowns, and career guidance.",
  path: "/",
});

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 10);

  const trendingTags = [
    "Quantum AI",
    "Qubits",
    "Quantum Security",
    "Quantum Algorithms",
    "Quantum Hardware",
    "Superconductors",
    "Qiskit",
    "Error Correction",
  ];

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background particle-like glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 to-violet-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accelerating the Quantum Transition</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Quantum Computing News, <br />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Research & Learning Hub
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore breakthroughs in quantum algorithms, cryogenics materials, and software engineering. Learn to program quantum circuits step-by-step.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/blog"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-sm tracking-wide rounded-lg shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
              >
                Read Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/news"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-white font-bold text-sm tracking-wide rounded-lg transition-all"
              >
                Latest News
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Insights Section */}
      <section className="py-16 bg-slate-950/40 relative border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Featured Insights
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Handpicked deep dives and tutorials from our editors.
              </p>
            </div>
            <Link
              href="/blog"
              className="group flex items-center space-x-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 mt-4 sm:mt-0 transition-colors"
            >
              <span>View all articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <ArticleCard key={post.slug} article={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Feed & Sidebar */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Latest News Feed */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Latest Research & Updates
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Stay ahead with our most recent publications.
                </p>
              </div>

              <div className="space-y-6">
                {latestPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-slate-900/10 border border-white/5 hover:border-violet-500/20 hover:bg-slate-900/30 transition-all duration-300"
                  >
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{formatDate(post.publishDate)}</span>
                        <span>•</span>
                        <Link href={`/categories/${post.category}`} className="text-cyan-400 hover:underline capitalize">
                          {post.category.replace("-", " ")}
                        </Link>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-violet-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                        <span>By {post.author || "Editor"}</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar widgets */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Trending Topics</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-muted border border-border hover:border-cyan-500/30 text-xs text-muted-foreground hover:text-cyan-500 cursor-pointer transition-all duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-violet-500/5 dark:from-cyan-950/20 dark:to-violet-950/20 border border-cyan-500/20 dark:border-cyan-500/10 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center space-x-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>Our Editorial Code</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every technical tutorial is thoroughly compiled and verified. Research summaries cite original academic publications directly. We maintain zero marketing fluff.
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs text-cyan-400 font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>100% Peer Reviewed Content</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter Block */}
      <NewsletterSignup />
    </div>
  );
}
