#!/usr/bin/env node

/**
 * AgoraCrew — Blog Post Registry + Static Page Builder
 *
 * Scans ./posts/ for .md files, parses YAML frontmatter, and:
 *   1. Writes posts.json (the blog engine's existing runtime data source).
 *   2. Renders each post's markdown to HTML and writes a fully static,
 *      pre-rendered page per post — real <title>, meta description,
 *      canonical, Open Graph, hreflang, and JSON-LD baked in at build time,
 *      not written in by client-side JS after the fact. This is what a
 *      crawler that doesn't execute JavaScript (and Google's *first* crawl
 *      pass, before its render queue gets to it) actually sees.
 *   3. Injects the same real links into blog/index.html's article grid as a
 *      static fallback, so the post list itself doesn't depend on JS either.
 *   4. Regenerates vercel.json's rewrite rules so the public URL
 *      (/blog/post.html?slug=X) transparently serves the static rendered
 *      file for that slug, while /blog/post.html itself (unrewritten) stays
 *      as a client-rendered fallback for any slug not yet built.
 *
 * Usage:
 *   node build-blog.js                Builds English posts (./posts/*.md -> ./posts.json)
 *   node build-blog.js --lang=fr      Builds French posts (./posts/fr/*.md -> ./posts.fr.json)
 *
 * Run this (or `npm run build:blog` from the repo root, which does both
 * languages) before deploying whenever you add or update a blog post.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SITE = 'https://agoracrew.com';
const REPO_ROOT = path.join(__dirname, '..');

const langArg = process.argv.find(a => a.startsWith('--lang='));
const lang = langArg ? langArg.split('=')[1] : 'en';
const POSTS_DIR = lang === 'en' ? path.join(__dirname, 'posts') : path.join(__dirname, 'posts', lang);
const OUTPUT_FILE = lang === 'en' ? path.join(__dirname, 'posts.json') : path.join(__dirname, `posts.${lang}.json`);

const LANG_CONFIG = {
  en: {
    blogDir: path.join(REPO_ROOT, 'blog'),
    indexHtmlPath: path.join(REPO_ROOT, 'blog', 'index.html'),
    postUrlBase: `${SITE}/blog/post.html`,
    rewriteSource: '/blog/post.html',
    renderedUrlDir: '/blog',
    dateLocale: 'en-US',
    titleSuffix: ' — AgoraCrew Blog',
    readArticle: 'Read article →',
    backToBlog: '← Back to Blog',
    homeLabel: 'Home',
    blogLabel: 'Blog',
    htmlLang: 'en',
    ogLocale: 'en_US',
    backHref: './'
  },
  fr: {
    blogDir: path.join(REPO_ROOT, 'fr', 'blog'),
    indexHtmlPath: path.join(REPO_ROOT, 'fr', 'blog', 'index.html'),
    postUrlBase: `${SITE}/fr/blog/post.html`,
    rewriteSource: '/fr/blog/post.html',
    renderedUrlDir: '/fr/blog',
    dateLocale: 'fr-FR',
    titleSuffix: ' — Blog AgoraCrew',
    readArticle: 'Lire l’article →',
    backToBlog: '← Retour au blog',
    homeLabel: 'Accueil',
    blogLabel: 'Blog',
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    backHref: './'
  }
};
const cfg = LANG_CONFIG[lang];

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

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    meta[key] = value;
  });

  return meta;
}

function bodyContent(fullContent) {
  if (!fullContent.startsWith('---')) return fullContent;
  const endIndex = fullContent.indexOf('---', 3);
  if (endIndex === -1) return fullContent;
  return fullContent.substring(endIndex + 3).trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr, locale) {
  const date = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

// Scan posts directory
if (!fs.existsSync(POSTS_DIR)) {
  console.error('Posts directory not found:', POSTS_DIR);
  process.exit(1);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

const rawPosts = files.map(file => {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const meta = parseFrontmatter(raw);
  const slug = file.replace(/\.md$/, '');
  return { slug, meta, raw };
});

const posts = rawPosts.map(({ slug, meta }) => ({
  slug,
  title: meta.title || slug,
  date: meta.date || new Date().toISOString().split('T')[0],
  description: meta.description || ''
}));

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2) + '\n');

console.log(`✅ Generated ${OUTPUT_FILE} with ${posts.length} post(s):`);
posts.forEach(p => console.log(`   - ${p.slug} (${p.date})`));

/* ==================== STATIC PAGE GENERATION ==================== */

// Cross-language lookup, so a post that exists in both trees gets a real
// hreflang alternate instead of only pointing at itself.
const otherLang = lang === 'en' ? 'fr' : 'en';
const otherPostsFile = lang === 'en'
  ? path.join(__dirname, 'posts.fr.json')
  : path.join(__dirname, 'posts.json');
const otherLangSlugs = fs.existsSync(otherPostsFile)
  ? new Set(JSON.parse(fs.readFileSync(otherPostsFile, 'utf-8')).map(p => p.slug))
  : new Set();

const CTA = {
  cx: {
    en: {
      heading: 'Or Hand It To <span class="accent-text">Someone Else</span>',
      body: 'AgoraCrew’s AI agents run the practices we write about on live stores — answering order-status questions, covering nights and weekends, and chasing abandoned carts.',
      href: '../index.html#contact',
      cta: 'Start My Free Trial →',
      badges: ['5 days free', 'No credit card', 'No lock-in']
    },
    fr: {
      heading: 'Ou confiez-le <span class="accent-text">à quelqu’un d’autre</span>',
      body: 'Les agents IA d’AgoraCrew appliquent sur des boutiques en activité les pratiques dont nous parlons ici — réponses sur le statut des commandes, couverture des nuits et week-ends, et relance des paniers abandonnés.',
      href: '../../fr/index.html#contact',
      cta: 'Essai gratuit →',
      badges: ['5 jours gratuits', 'Sans carte bancaire', 'Sans engagement']
    }
  },
  arbridge: {
    en: {
      heading: 'See <span class="accent-text">ARBridge for QuickBooks</span> In Action',
      body: 'ARBridge is a read-only sync from QuickBooks Desktop into HubSpot — AR aging, credit status, and payment history on every Company and Contact record, without ever giving anyone write access to your books.',
      href: '../index.html#contact',
      cta: 'Request Access →',
      badges: ['Read-only sync', 'Live on HubSpot', 'Free setup']
    }
    // No French ARBridge post exists yet - add an `fr` variant here first if
    // one ever does. buildPost() below falls back to the `cx` CTA rather
    // than publish untranslated/unreviewed copy.
  }
};

function ctaHtml(productKey) {
  const variant = (CTA[productKey] && CTA[productKey][lang]) || CTA.cx[lang];
  const badges = variant.badges.map(b => `      <span class="page-cta-badge">${escapeHtml(b)}</span>`).join('\n');
  return `  <section class="page-cta-section">
    <h2>${variant.heading}</h2>
    <p>
      ${variant.body}
    </p>
    <a href="${variant.href}" class="cta-button">${variant.cta}</a>
    <div class="page-cta-badges">
${badges}
    </div>
  </section>`;
}

function jsonLd(post, canonicalUrl) {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    inLanguage: cfg.htmlLang,
    author: { '@type': 'Organization', name: 'AgoraCrew', url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'AgoraCrew',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo-new-orange.png` }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: cfg.homeLabel, item: lang === 'en' ? `${SITE}/` : `${SITE}/fr/index.html` },
      { '@type': 'ListItem', position: 2, name: cfg.blogLabel, item: `${SITE}${cfg.renderedUrlDir}/index.html` },
      { '@type': 'ListItem', position: 3, name: post.meta.title, item: canonicalUrl }
    ]
  };

  return `  <script type="application/ld+json">${JSON.stringify(article)}</script>\n  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
}

function buildPost(post) {
  const { slug, meta } = post;
  const canonicalUrl = `${cfg.postUrlBase}?slug=${encodeURIComponent(slug)}`;
  const bodyHtml = marked.parse(bodyContent(post.raw));
  const title = escapeHtml(meta.title || slug);
  const description = escapeHtml(meta.description || '');

  const alternates = [
    `  <link rel="alternate" hreflang="${cfg.htmlLang}" href="${canonicalUrl}" />`
  ];
  if (otherLangSlugs.has(slug)) {
    const otherCfg = LANG_CONFIG[otherLang];
    alternates.push(`  <link rel="alternate" hreflang="${otherCfg.htmlLang}" href="${otherCfg.postUrlBase}?slug=${encodeURIComponent(slug)}" />`);
  }
  if (lang === 'en') {
    alternates.push(`  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`);
  }

  const cta = ctaHtml(meta.product === 'arbridge' ? 'arbridge' : 'cx');
  const dateFormatted = formatDate(meta.date, cfg.dateLocale);

  const html = `<!DOCTYPE html>
<html lang="${cfg.htmlLang}">
<head>
  <script id="vtag-ai-js" async src="https://r2.leadsy.ai/tag.js" data-pid="8j5CAUfYGrN1G6ll" data-version="062024"></script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#ffffff" />
  <title>${title}${cfg.titleSuffix}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="${cfg.ogLocale}" />
${alternates.join('\n')}
${jsonLd(post, canonicalUrl)}

  <link rel="preconnect" href="https://api.fontshare.com" crossorigin />
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@100,200,300,400,500,600,700,800,900&f[]=satoshi@300,400,500,600,700,800,900&display=swap" />

  <link rel="stylesheet" href="${cfg.blogDir === path.join(REPO_ROOT, 'blog') ? '..' : '../..'}/styles.css" />
  <link rel="stylesheet" href="${cfg.blogDir === path.join(REPO_ROOT, 'blog') ? '..' : '../..'}/pages.css" />

  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📩</text></svg>" />

  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>

  <div id="navbar-root"></div>

  <header class="blog-post-header">
    <a href="${cfg.backHref}" class="blog-back-link">${cfg.backToBlog}</a>
    <div class="blog-post-meta">${dateFormatted}</div>
    <h1 class="blog-post-title">${title}</h1>
    <p class="blog-post-description">${description}</p>
  </header>

  <article class="blog-post-content">
${bodyHtml}
  </article>

${cta}

  <div id="footer-root"></div>

  <script src="${cfg.blogDir === path.join(REPO_ROOT, 'blog') ? '..' : '../..'}/components.js" data-base="${cfg.blogDir === path.join(REPO_ROOT, 'blog') ? '..' : '../..'}"${lang === 'fr' ? ' data-locale="fr"' : ''}></script>
  <script defer src="https://api.agoracrew.com/widget/widget.js" data-client-id="agoracrew" data-client-name="AgoraCrew"></script>
</body>
</html>
`;

  const outFile = path.join(cfg.blogDir, `rendered-${slug}.html`);
  fs.writeFileSync(outFile, html);
  return outFile;
}

const generatedFiles = rawPosts.map(buildPost);
console.log(`✅ Generated ${generatedFiles.length} static post page(s) in ${cfg.blogDir}`);

/* ==================== BLOG INDEX GRID (static fallback) ==================== */

const cardsHtml = posts.map(p => {
  const dateFormatted = formatDate(p.date, cfg.dateLocale);
  return `    <a href="post.html?slug=${encodeURIComponent(p.slug)}" class="blog-card">
      <div class="blog-card-body">
        <div class="blog-card-date">${dateFormatted}</div>
        <h3 class="blog-card-title">${escapeHtml(p.title)}</h3>
        <p class="blog-card-excerpt">${escapeHtml(p.description)}</p>
        <span class="blog-card-link">${cfg.readArticle}</span>
      </div>
    </a>`;
}).join('\n');

if (fs.existsSync(cfg.indexHtmlPath)) {
  const indexHtml = fs.readFileSync(cfg.indexHtmlPath, 'utf-8');
  const startMarker = '<!-- BLOG-GRID:START -->';
  const endMarker = '<!-- BLOG-GRID:END -->';
  const startIdx = indexHtml.indexOf(startMarker);
  const endIdx = indexHtml.indexOf(endMarker);
  if (startIdx !== -1 && endIdx !== -1) {
    const updated = indexHtml.slice(0, startIdx + startMarker.length) +
      '\n' + cardsHtml + '\n    ' +
      indexHtml.slice(endIdx);
    fs.writeFileSync(cfg.indexHtmlPath, updated);
    console.log(`✅ Updated static article grid in ${cfg.indexHtmlPath}`);
  } else {
    console.warn(`⚠️  BLOG-GRID markers not found in ${cfg.indexHtmlPath} - skipped static grid update.`);
  }
}

/* ==================== VERCEL REWRITES ==================== */
// Rebuilt from scratch every run (from whichever of posts.json/posts.fr.json
// exist on disk right now) rather than merged incrementally, so there's no
// risk of stale or duplicate rules accumulating across repeated builds.

const vercelJsonPath = path.join(REPO_ROOT, 'vercel.json');
const vercelConfig = fs.existsSync(vercelJsonPath) ? JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8')) : {};

const enPostsFile = path.join(__dirname, 'posts.json');
const frPostsFile = path.join(__dirname, 'posts.fr.json');
const rewrites = [];

// IMPORTANT: /blog/post.html and /fr/blog/post.html must NOT exist as real
// files on disk (they're named post-shell.html instead). Vercel resolves an
// exact static-file match before it ever evaluates rewrites, so if the
// shell lived at the literal source path, every one of these rules below
// would silently never fire - confirmed live (X-Vercel-Id showed the new
// deploy, but the old generic shell kept serving) before catching this.
if (fs.existsSync(enPostsFile)) {
  JSON.parse(fs.readFileSync(enPostsFile, 'utf-8')).forEach(p => {
    rewrites.push({
      source: '/blog/post.html',
      has: [{ type: 'query', key: 'slug', value: p.slug }],
      destination: `/blog/rendered-${p.slug}.html`
    });
  });
  // Catch-all: any slug not covered above (or no slug at all) falls back to
  // the client-rendered shell, same behavior as before this build step
  // existed. Must come after the specific rules above - first match wins.
  rewrites.push({ source: '/blog/post.html', destination: '/blog/post-shell.html' });
}
if (fs.existsSync(frPostsFile)) {
  JSON.parse(fs.readFileSync(frPostsFile, 'utf-8')).forEach(p => {
    rewrites.push({
      source: '/fr/blog/post.html',
      has: [{ type: 'query', key: 'slug', value: p.slug }],
      destination: `/fr/blog/rendered-${p.slug}.html`
    });
  });
  rewrites.push({ source: '/fr/blog/post.html', destination: '/fr/blog/post-shell.html' });
}

vercelConfig.rewrites = rewrites;
fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2) + '\n');
console.log(`✅ Updated vercel.json with ${rewrites.length} rewrite rule(s)`);
