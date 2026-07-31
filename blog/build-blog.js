#!/usr/bin/env node

/**
 * AgoraCrew — Blog Post Registry Builder
 *
 * Scans the ./posts/ directory for .md files, parses their YAML frontmatter,
 * and generates a posts.json file for the blog engine.
 *
 * Usage:
 *   node build-blog.js
 *
 * Run this before deploying whenever you add or update a blog post.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_FILE = path.join(__dirname, 'posts.json');

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return {};

  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) return {};

  const frontmatter = content.substring(3, endIndex).trim();
  const meta = {};

  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim().toLowerCase();
    let value = line.substring(colonIndex + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    meta[key] = value;
  });

  return meta;
}

// Scan posts directory
if (!fs.existsSync(POSTS_DIR)) {
  console.error('Posts directory not found:', POSTS_DIR);
  process.exit(1);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const meta = parseFrontmatter(content);
  const slug = file.replace(/\.md$/, '');

  return {
    slug: slug,
    title: meta.title || slug,
    date: meta.date || new Date().toISOString().split('T')[0],
    description: meta.description || ''
  };
});

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2) + '\n');

console.log(`✅ Generated ${OUTPUT_FILE} with ${posts.length} post(s):`);
posts.forEach(p => console.log(`   - ${p.slug} (${p.date})`));
