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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /* ==================== BLOG INDEX ==================== */
  var blogGrid = document.getElementById('blog-grid');

  if (blogGrid) {
    blogGrid.innerHTML = '<div class="blog-loading">Loading posts...</div>';

    fetch('posts.json')
      .then(function (res) { return res.json(); })
      .then(function (posts) {
        if (!posts || posts.length === 0) {
          blogGrid.innerHTML =
            '<div class="blog-empty">' +
              '<p>Nothing published yet. The guides below are the place to start.</p>' +
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
                '<span class="blog-card-link">Read article →</span>' +
              '</div>' +
            '</a>';
        });

        blogGrid.innerHTML = html;
      })
      .catch(function () {
        blogGrid.innerHTML =
          '<div class="blog-empty">' +
            '<p>The article list didn\'t load. Reload the page, or browse the guides below.</p>' +
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
      postContentEl.innerHTML = '<p>Post not found. <a href="./">Back to blog</a></p>';
      return;
    }

    postContentEl.innerHTML = '<div class="blog-loading">Loading post...</div>';

    fetch('posts/' + slug + '.md')
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(function (markdown) {
        var parsed = parseFrontmatter(markdown);
        var meta = parsed.meta;

        // Update page title
        if (meta.title) {
          document.title = meta.title + ' — AgoraCrew Blog';
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
            '<p>That article isn\'t here. <a href="./">Back to the blog</a></p>' +
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
