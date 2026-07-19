const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_ROOT = path.join(process.cwd(), "content");
const CONTENT_SUBDIRS = ["articles", "news", "tutorials", "research"];
const OUTPUT_FILE = path.join(process.cwd(), "src", "lib", "posts-cache.json");

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const noOfWords = text.trim().split(/\s+/).length;
  return Math.ceil(noOfWords / wordsPerMinute);
}

function isHiddenPost(data) {
  if (data.draft === true) return true;
  if (typeof data.publishDate === "string") {
    const pub = new Date(data.publishDate);
    if (pub.getTime() > Date.now()) return true;
  }
  return false;
}

function parseFile(filePath, section) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (isHiddenPost(data)) return null;

  const slug = path.basename(filePath, ".mdx");

  return {
    slug,
    section,
    content,
    title: data.title ?? slug,
    description: data.description ?? "",
    publishDate: data.publishDate ?? data.date ?? "",
    updatedDate: data.updatedDate,
    author: data.author ?? "Quantum Editorial Team",
    authorAvatar: data.authorAvatar,
    category: data.category ?? section,
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage,
    coverImageAlt: data.coverImageAlt,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    readingTime: calculateReadingTime(content),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    source: data.source ?? "original",
    sourceUrl: data.sourceUrl,
    sourceName: data.sourceName,
  };
}

function collectMdxFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dirPath, f));
}

function buildCache() {
  console.log("⚡️ Building posts cache for Edge runtime...");
  const posts = [];

  for (const subdir of CONTENT_SUBDIRS) {
    const dir = path.join(CONTENT_ROOT, subdir);
    const files = collectMdxFiles(dir);
    for (const file of files) {
      const article = parseFile(file, subdir);
      if (article) posts.push(article);
    }
  }

  // Check root content/ directory
  const rootFiles = collectMdxFiles(CONTENT_ROOT);
  for (const file of rootFiles) {
    const article = parseFile(file, "articles");
    if (article) posts.push(article);
  }

  // Sort newest first
  posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Write output JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), "utf-8");
  console.log(`✅ Successfully generated posts cache at ${OUTPUT_FILE} (${posts.length} posts)`);
}

buildCache();
