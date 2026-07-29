const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_ROOT = path.join(process.cwd(), "content");
const CONTENT_SUBDIRS = ["articles", "news", "tutorials", "research"];

function collectMdxFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(collectMdxFiles(filePath));
    } else if (file.endsWith(".mdx")) {
      results.push(filePath);
    }
  });
  return results;
}

function cleanEscapes(str) {
  if (!str) return "";
  // Unescape double quotes and backslashes introduced by old aggregator escaping
  return str
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\\{/g, "{")
    .replace(/\\\}/g, "}")
    .trim();
}

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  
  // Split frontmatter and body
  const parts = raw.split("---");
  if (parts.length < 3) {
    console.log(`Skipping invalid MDX: ${filePath}`);
    return;
  }
  
  const frontmatterText = parts[1];
  const bodyText = parts.slice(2).join("---");
  
  // Parse frontmatter lines manually to avoid YAML parse errors
  const metadata = {};
  const tags = [];
  let inTags = false;
  
  const lines = frontmatterText.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed === "tags:") {
      inTags = true;
      metadata.tags = tags;
      return;
    }
    
    if (inTags && trimmed.startsWith("-")) {
      tags.push(trimmed.substring(1).trim().replace(/^['"]|['"]$/g, ""));
      return;
    }
    
    // If we hit another key, we are out of tags
    if (trimmed.includes(":")) {
      inTags = false;
      const colonIdx = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIdx).trim();
      let val = trimmed.substring(colonIdx + 1).trim();
      
      // Remove enclosing quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      
      metadata[key] = cleanEscapes(val);
    }
  });
  
  // Re-serialize frontmatter safely using single quotes
  const cleanTitle = (metadata.title || "").replace(/'/g, "''");
  const cleanDescription = (metadata.description || "").replace(/'/g, "''");
  const cleanSourceName = (metadata.sourceName || "").replace(/'/g, "''");
  const cleanSourceUrl = (metadata.sourceUrl || "").replace(/'/g, "''");
  
  const newFrontmatter = `---
title: '${cleanTitle}'
description: '${cleanDescription}'
date: '${metadata.date || ""}'
category: '${metadata.category || ""}'
tags:
${(metadata.tags || []).map((t) => `  - ${t}`).join("\n")}
author: 'Quantum Editorial Team'
source: '${metadata.source || "original"}'
sourceName: '${cleanSourceName}'
sourceUrl: '${cleanSourceUrl}'
featured: ${metadata.featured === "true" || metadata.featured === true}
draft: ${metadata.draft === "true" || metadata.draft === true}
---`;

  // Write file back
  const newContent = `${newFrontmatter}\n\n${bodyText.trim()}\n`;
  fs.writeFileSync(filePath, newContent, "utf-8");
  console.log(`Migrated: ${path.basename(filePath)}`);
}

function migrateAll() {
  console.log("Starting frontmatter migration to single quotes...");
  const files = collectMdxFiles(CONTENT_ROOT);
  console.log(`Found ${files.length} MDX files to check.`);
  files.forEach((file) => {
    try {
      migrateFile(file);
    } catch (e) {
      console.error(`Failed to migrate ${file}:`, e);
    }
  });
  console.log("Migration complete!");
}

migrateAll();
