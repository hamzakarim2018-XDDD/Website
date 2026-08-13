/**
 * AgoraCrew — Markdown Blog Engine
 * Handles both the blog index (listing) and individual post rendering.
 *
 * Index page: Fetches posts.json, renders card grid into #blog-grid
 * Post page:  Reads ?slug= param, fetches matching .md, parses frontmatter, renders into #blog-post-title / #blog-post-content etc.
 *
 * Dependencies: marked.js (loaded via CDN in the HTML pages)
 */

(function () {
  'use strict';

  /* ==================== LOCALE ==================== */
  // This file is shared by both the English (blog/index.html, blog/post.html)
  // and French (fr/blog/index.html, fr/blog/post.html) pages — same pattern
  // components.js uses for data-locale. French pages set <html lang="fr">.
  var isFr = document.documentElement.lang === 'fr';

  // French pages live at fr/blog/ (two levels below site root) but the
  // posts.fr.json / posts/fr/*.md data lives under blog/ (one level below
  // root) — so the French fetch paths need to climb back up to root first.
  var POSTS_JSON_URL = isFr ? '../../blog/posts.fr.json' : 'posts.json';
  var POSTS_MD_BASE = isFr ? '../../blog/posts/fr/' : 'posts/';

  var STRINGS = {
    en: {
      loadingPosts: 'Loading posts...',
      noPosts: 'Nothing published yet. The guides below are the place to start.',
      loadError: 'The article list didn\'t load. Reload the page, or browse the guides below.',
      readArticle: 'Read article →',
      loadingPost: 'Loading post...',
      postNotFound: 'Post not found. ',
      backToBlog: 'Back to blog',
      postLoadError: 'That article isn\'t here. ',
      titleSuffix: ' — AgoraCrew Blog',
      dateLocale: 'en-US'
    },
    fr: {
      loadingPosts: 'Chargement des articles...',
      noPosts: 'Rien n\'a encore été publié. Les guides ci-dessous sont un bon point de départ.',
      loadError: 'La liste des articles n\'a pas pu être chargée. Rechargez la page, ou parcourez les guides ci-dessous.',
      readArticle: 'Lire l\'article →',
      loadingPost: 'Chargement de l\'article...',
      postNotFound: 'Article introuvable. ',
      backToBlog: 'Retour au blog',
      postLoadError: 'Cet article est introuvable. ',
      titleSuffix: ' — Blog AgoraCrew',
      dateLocale: 'fr-FR'
    }
  };
  var t = STRINGS[isFr ? 'fr' : 'en'];

  /* ==================== FRONTMATTER PARSER ==================== */
  function parseFrontmatter(markdown) {
    var result = { meta: {}, content: markdown };

    if (!markdown.startsWith('---')) return result;

    var endIndex = markdown.indexOf('---', 3);
    if (endIndex === -1) return result;

    var frontmatter = markdown.substring(3, endIndex).trim();
    var content = markdown.substring(endIndex + 3).trim();

    var meta = {};
    frontmatter.split('\n').forEach(function (line) {
      var colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;
      var key = line.substring(0, colonIndex).trim().toLowerCase();
      var value = line.substring(colonIndex + 1).trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      meta[key] = value;
    });

    return { meta: meta, content: content };
  }

  /* ==================== DATE FORMATTER ==================== */
  function formatDate(dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(t.dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /* ==================== HREFLANG (post pages only) ==================== */
  // post.html is a shared template rendered for any ?slug=, so the
  // hreflang alternates can't be baked into the static HTML — they're
  // inserted once the slug is known, mirroring how <title> and the meta
  // description are already updated dynamically below.
  function setHreflang(lang, href) {
    var link = document.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  function updateHreflangForSlug(slug) {
    var enUrl = 'https://agoracrew.com/blog/post.html?slug=' + encodeURIComponent(slug);
    var frUrl = 'https://agoracrew.com/fr/blog/post.html?slug=' + encodeURIComponent(slug);
    setHreflang('en', enUrl);
    setHreflang('fr', frUrl);
    setHreflang('x-default', enUrl);
  }

  /* ==================== BLOG INDEX ==================== */
  var blogGrid = document.getElementById('blog-grid');

  if (blogGrid) {
    blogGrid.innerHTML = '<div class="blog-loading">' + t.loadingPosts + '</div>';

    fetch(POSTS_JSON_URL)
      .then(function (res) { return res.json(); })
      .then(function (posts) {
        if (!posts || posts.length === 0) {
          blogGrid.innerHTML =
            '<div class="blog-empty">' +
              '<p>' + t.noPosts + '</p>' +
            '</div>';
          return;
        }

        // Sort by date descending
        posts.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        var html = '';
        posts.forEach(function (post) {
          html +=
            '<a href="post.html?slug=' + encodeURIComponent(post.slug) + '" class="blog-card">' +
              '<div class="blog-card-body">' +
                '<div class="blog-card-date">' + formatDate(post.date) + '</div>' +
                '<h3 class="blog-card-title">' + escapeHtml(post.title) + '</h3>' +
                '<p class="blog-card-excerpt">' + escapeHtml(post.description) + '</p>' +
                '<span class="blog-card-link">' + t.readArticle + '</span>' +
              '</div>' +
            '</a>';
        });

        blogGrid.innerHTML = html;
      })
      .catch(function () {
        blogGrid.innerHTML =
          '<div class="blog-empty">' +
            '<p>' + t.loadError + '</p>' +
          '</div>';
      });
  }

  /* ==================== BLOG POST ==================== */
  var postTitleEl = document.getElementById('blog-post-title');
  var postMetaEl = document.getElementById('blog-post-meta');
  var postDescEl = document.getElementById('blog-post-description');
  var postContentEl = document.getElementById('blog-post-content');

  if (postContentEl) {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');

    if (!slug) {
      postContentEl.innerHTML = '<p>' + t.postNotFound + '<a href="./">' + t.backToBlog + '</a></p>';
      return;
    }

    updateHreflangForSlug(slug);

    postContentEl.innerHTML = '<div class="blog-loading">' + t.loadingPost + '</div>';

    fetch(POSTS_MD_BASE + slug + '.md')
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(function (markdown) {
        var parsed = parseFrontmatter(markdown);
        var meta = parsed.meta;

        // Update page title
        if (meta.title) {
          document.title = meta.title + t.titleSuffix;
          if (postTitleEl) postTitleEl.textContent = meta.title;
        }

        // Update meta description
        if (meta.description) {
          var metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', meta.description);
          if (postDescEl) postDescEl.textContent = meta.description;
        }

        // Update date
        if (meta.date && postMetaEl) {
          postMetaEl.textContent = formatDate(meta.date);
        }

        // Swap the end-of-post CTA for posts about a specific product, so a
        // reader who came in on a QuickBooks/HubSpot search term doesn't land
        // on a Shopify-abandoned-cart pitch. Only post.html defines these
        // two sections; fr/blog/post.html doesn't yet, hence the null checks.
        if (meta.product) {
          var ctaDefault = document.getElementById('page-cta-cx');
          var ctaProduct = document.getElementById('page-cta-' + meta.product);
          if (ctaProduct) {
            if (ctaDefault) ctaDefault.style.display = 'none';
            ctaProduct.style.display = '';
          }
        }

        // Render markdown
        if (typeof marked !== 'undefined') {
          postContentEl.innerHTML = marked.parse(parsed.content);
        } else {
          // Fallback: render as plain text with basic paragraph handling
          postContentEl.innerHTML = '<div style="white-space: pre-line;">' + escapeHtml(parsed.content) + '</div>';
        }
      })
      .catch(function () {
        postContentEl.innerHTML =
          '<div class="blog-empty">' +
            '<p>' + t.postLoadError + '<a href="./">' + t.backToBlog + '</a></p>' +
          '</div>';
      });
  }

  /* ==================== UTILITIES ==================== */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
