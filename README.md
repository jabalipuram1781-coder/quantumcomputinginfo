# QuantumComputingInfo.com

A premium, SEO-optimized Quantum Computing news, blog, and tutorials platform built with Next.js 15, Tailwind CSS v4, and MDX.

It features a **fully automated content aggregation pipeline** that pulls quantum computing news and preprints from top research and industry feeds, parses them, escapes code conflicts, and publishes them automatically as static blog posts.

---

## 🚀 Features

- **Dynamic Homepage**: Hero section, stats bar, featured grid, latest news list, trending topics, and newsletter signup.
- **Automated RSS Aggregator**: Periodically fetches and parses feeds from arXiv, IBM Research, Google AI, ScienceDaily, and Quantum Computing Report. Deduplicates content using hashes.
- **SEO Ready**: Dynamic sitemaps, robots.txt, dynamic OpenGraph/Twitter card images, canonical URLs, and structured JSON-LD schemas.
- **Premium Dark Aesthetics**: Styled in a sleek dark quantum theme with CSS-based floating glowing orbs and grid backgrounds.
- **Client Search**: Fuzzy search powered by Fuse.js indexing titles, categories, descriptions, and tags.
- **Interactions**:
  - Giscus Comments (GitHub-authenticated discussions).
  - Cloudflare Turnstile protected contact form & newsletter signup.
  - Kit (ConvertKit) API newsletter subscription.
  - Scroll progress bar & Back-to-Top triggers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui & Radix UI
- **RSS Parsing**: `rss-parser` & `feed`
- **Markdown Renderer**: `next-mdx-remote`
- **Client Search**: `fuse.js`
- **Analytics**: Cloudflare Analytics & Google Analytics 4

---

## 📁 Project Structure

```text
├── content/                     # MDX Content
│   ├── articles/                # Original educational articles
│   ├── news/                    # Aggregated industry news
│   ├── research/                # Aggregated academic research
│   ├── tutorials/               # Hands-on tutorials
│   └── hashes.json              # Aggregation deduplication database
├── scripts/
│   ├── feed-sources.json        # RSS feed urls and limits configuration
│   └── aggregate-content.ts     # Aggregator runtime script
├── src/
│   ├── app/                     # Pages & Layouts
│   ├── components/              # Reusable UI components
│   └── lib/                     # Utilities & Constants
└── .github/workflows/           # CI/CD Workflows
    ├── aggregate-content.yml    # Runs cron aggregator
    └── deploy.yml               # Deploys to Cloudflare Workers
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Cloudflare Turnstile Captcha
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# Kit (ConvertKit) Newsletter Settings
KIT_API_KEY=your-api-key
KIT_FORM_ID=your-form-id

# Giscus Comments Settings
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxx
```

---

## 🏃 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the aggregation pipeline** (manually fetch latest feeds):
   ```bash
   npx tsx scripts/aggregate-content.ts
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Verify production compilation**:
   ```bash
   npm run build
   ```

---

## 🚀 Deployment to Cloudflare Workers

The project is configured to deploy to Cloudflare Workers using Wrangler.

### GitHub Actions Deployment

1. Add your repository secrets in GitHub (`Settings -> Secrets and variables -> Actions`):
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare Wrangler API Token.
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID.
2. Push changes to `main`. The `.github/workflows/deploy.yml` workflow will automatically build and publish to your Cloudflare Workers deployment.
