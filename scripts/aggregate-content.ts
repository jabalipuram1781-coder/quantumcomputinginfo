import Parser from "rss-parser";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

interface FeedSource {
  name: string;
  url: string;
  category: string;
  type: string;
  enabled: boolean;
  maxItemsPerRun: number;
}

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
  }
});

// Paths
const PROJECT_ROOT = path.join(__dirname, "..");
const HASHES_FILE = path.join(PROJECT_ROOT, "content", "hashes.json");
const SOURCES_FILE = path.join(PROJECT_ROOT, "scripts", "feed-sources.json");

// Helper to slugify title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper to clean and format date
function formatDate(dateStr?: string): { iso: string; readable: string } {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date.getTime())) {
    return {
      iso: new Date().toISOString().split("T")[0],
      readable: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };
  }
  return {
    iso: date.toISOString().split("T")[0],
    readable: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  };
}

async function run() {
  console.log("Starting quantum content aggregation...");

  // Load hashes
  let hashes: string[] = [];
  if (fs.existsSync(HASHES_FILE)) {
    try {
      hashes = JSON.parse(fs.readFileSync(HASHES_FILE, "utf-8"));
    } catch (e) {
      console.error("Error loading hashes file, resetting hashes database:", e);
    }
  }

  // Load sources
  if (!fs.existsSync(SOURCES_FILE)) {
    console.error("Sources config file not found at:", SOURCES_FILE);
    process.exit(1);
  }
  const sources: FeedSource[] = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf-8"));

  const activeSources = sources.filter((s) => s.enabled);
  console.log(`Loaded ${activeSources.length} active feed sources.`);

  const newHashes: string[] = [];

  for (const source of activeSources) {
    console.log(`Fetching feed: ${source.name} (${source.url})`);
    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml, */*"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xmlText = await response.text();
      const feed = await parser.parseString(xmlText.trim());

      let items = feed.items;

      // Filter IEEE Spectrum items to only include quantum-related ones
      if (source.name.includes("IEEE Spectrum")) {
        const initialCount = items.length;
        items = items.filter(item => {
          const searchIn = `${item.title || ""} ${item.contentSnippet || ""} ${item.content || ""}`.toLowerCase();
          return searchIn.includes("quantum");
        });
        console.log(`Filtered IEEE Spectrum feed: kept ${items.length} of ${initialCount} items matching "quantum".`);
      }

      const itemsToProcess = items.slice(0, source.maxItemsPerRun);
      console.log(`Found ${items.length} items (after filtering). Processing first ${itemsToProcess.length}...`);

      for (const item of itemsToProcess) {
        if (!item.link || !item.title) continue;

        // Hash the URL
        const hash = crypto.createHash("sha256").update(item.link).digest("hex");

        if (hashes.includes(hash)) {
          console.log(`- Skipping duplicate: "${item.title}"`);
          continue;
        }

        console.log(`+ Processing new item: "${item.title}"`);

        const cleanTitle = item.title.replace(/"/g, '\\"').replace(/\{/g, '\\{').replace(/\}/g, '\\}').trim();
        const rawContent = item.contentSnippet || item.content || "";
        const cleanDescription = stripHtml(rawContent).substring(0, 160).replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/"/g, '\\"').trim() + "...";
        const cleanBody = stripHtml(rawContent).replace(/\{/g, '\\{').replace(/\}/g, '\\}').trim();

        const dates = formatDate(item.pubDate || item.isoDate);
        const slug = `${slugify(cleanTitle)}-${hash.substring(0, 6)}`;

        // Guess tags from category and content
        const tagsSet = new Set<string>([source.category]);
        const lowerBody = cleanBody.toLowerCase();
        
        if (lowerBody.includes("qiskit")) tagsSet.add("qiskit");
        if (lowerBody.includes("qubit")) tagsSet.add("qubits");
        if (lowerBody.includes("ibm")) tagsSet.add("ibm");
        if (lowerBody.includes("google")) tagsSet.add("google");
        if (lowerBody.includes("error correction")) tagsSet.add("error-correction");
        if (lowerBody.includes("algorithm")) tagsSet.add("algorithms");
        if (lowerBody.includes("hardware")) tagsSet.add("hardware");
        if (lowerBody.includes("supremacy")) tagsSet.add("quantum-supremacy");
        if (lowerBody.includes("cryptography") || lowerBody.includes("encryption")) tagsSet.add("security");

        const tags = Array.from(tagsSet);

        // Generate MDX file contents
        const fileContent = `---
title: "${cleanTitle}"
description: "${cleanDescription.replace(/"/g, '\\"')}"
date: "${dates.iso}"
category: "${source.category}"
tags:
${tags.map((t) => `  - ${t}`).join("\n")}
author: "Quantum Editorial Team"
source: "aggregated"
sourceName: "${source.name}"
sourceUrl: "${item.link}"
featured: false
draft: false
---

# ${cleanTitle}

> **Source:** Originally published on [${source.name}](${item.link}) on ${dates.readable}.

${cleanBody.length > 500 ? cleanBody.substring(0, 800) + "..." : cleanBody}

---

To read the full article, visit the original source page:

[Read the full article on ${source.name} →](${item.link})
`;

        // Ensure category directory exists
        const categoryDir = path.join(PROJECT_ROOT, "content", source.category);
        if (!fs.existsSync(categoryDir)) {
          fs.mkdirSync(categoryDir, { recursive: true });
        }

        // Save MDX file
        const mdxPath = path.join(categoryDir, `${slug}.mdx`);
        fs.writeFileSync(mdxPath, fileContent, "utf-8");
        console.log(`  Saved MDX to: ${mdxPath}`);

        newHashes.push(hash);
      }
    } catch (e) {
      console.error(`Error processing feed ${source.name}:`, e);
    }
  }

  // Update hashes file
  if (newHashes.length > 0) {
    const updatedHashes = [...hashes, ...newHashes];
    // Ensure parent dir exists
    const hashesDir = path.dirname(HASHES_FILE);
    if (!fs.existsSync(hashesDir)) {
      fs.mkdirSync(hashesDir, { recursive: true });
    }
    fs.writeFileSync(HASHES_FILE, JSON.stringify(updatedHashes, null, 2), "utf-8");
    console.log(`Aggregation complete. Added ${newHashes.length} new items to hashes database.`);
  } else {
    console.log("Aggregation complete. No new items found.");
  }
}

run();
