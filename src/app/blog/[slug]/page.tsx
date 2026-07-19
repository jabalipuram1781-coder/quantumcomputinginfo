import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/content";
import { getCategoryBySlug } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ReadingProgress } from "@/components/layout/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { GiscusComments } from "@/components/comments/GiscusComments";
import { BackToTop } from "@/components/layout/BackToTop";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { SourceBadge } from "@/components/blog/SourceBadge";
import { ArticleSummarizer } from "@/components/blog/ArticleSummarizer";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { generateMetadata as siteGenerateMetadata } from "@/lib/metadata";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  return siteGenerateMetadata({
    title: `${post.title} | QuantumComputingInfo`,
    description: post.description,
    path: `/blog/${resolvedParams.slug}`,
    ogImage: post.coverImage,
    publishedTime: post.publishDate,
    tags: post.tags,
    type: "article",
  });
}

function extractHeadings(content: string) {
  const headingRegex = /^(##|###)\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // 2 or 3
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }
  return headings;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const relatedArticles = await getRelatedPosts(post.slug, post.category, post.tags);
  const categoryInfo = getCategoryBySlug(post.category);

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    {
      label: categoryInfo ? categoryInfo.name : post.category,
      href: `/blog?category=${post.category}`,
    },
    { label: post.title },
  ];

  const postUrl = `https://quantumcomputinginfo.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      <BackToTop />

      {/* Hero Header */}
      <header className="relative overflow-hidden bg-white/[0.01] border-b border-white/5 py-12 sm:py-16">
        {/* Glow */}
        <div
          className="absolute right-1/4 top-1/4 size-80 rounded-full opacity-10 blur-[120px]"
          style={{ backgroundColor: categoryInfo?.color || "#8b5cf6" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <CategoryBadge category={post.category} size="md" />
            {post.source && (
              <SourceBadge source={post.source} sourceName={post.sourceName} />
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-foreground">
            {post.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {post.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="size-4 text-violet-500 dark:text-violet-400" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-cyan-500 dark:text-cyan-400" />
              <span>
                {new Date(post.publishDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-emerald-500 dark:text-emerald-400" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Sidebar / Left - empty/flex spacing for center alignment */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Share this article
                </span>
                <ShareButtons title={post.title} url={postUrl} />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <main className="lg:col-span-2">
            {post.source === "aggregated" && post.sourceUrl && (
              <div className="mb-6 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 text-sm text-violet-700 dark:text-violet-300">
                This article has been aggregated from{" "}
                <span className="font-semibold text-foreground">{post.sourceName}</span>. You can read
                the original publication at{" "}
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {post.sourceUrl}
                </a>
                .
              </div>
            )}

            <ArticleSummarizer title={post.title} content={post.content} />

            <article className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-violet-650 dark:prose-a:text-violet-400 hover:prose-a:text-violet-800 dark:hover:prose-a:text-violet-300">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </article>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Giscus Comments */}
            <div className="mt-16 border-t border-border pt-8">
              <GiscusComments />
            </div>
          </main>

          {/* Sidebar / Right - Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-1">
            <TableOfContents headings={headings} />
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <RelatedArticles articles={relatedArticles} />
          </div>
        )}
      </div>
    </div>
  );
}
