# Website French Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full `/fr` mirror of the marketing site (homepage, solutions, resources, blog, privacy policy, CX audit tool, plus two new French-only legal pages), with a detect-and-prompt language banner and correct `hreflang` signaling — with zero visible change to the existing English site.

**Architecture:** No build step exists on this site today and this plan doesn't add one (blog's `build-blog.js` is the one exception, already a build step, and gets parameterized rather than replaced). French pages are hand-authored HTML files under a new `/fr/` directory tree that mirrors the existing tree 1:1 (`fr/solutions/wismo-automation.html` mirrors `solutions/wismo-automation.html`, same filename — simpler engineering and a simpler language switcher than translated URL slugs, at no SEO cost since `hreflang` — not the URL — is what signals language to Google). `components.js` (the shared nav injected on every inner page) becomes locale-aware via a `data-locale` attribute, so translating the nav happens once, not per-page.

**Tech Stack:** Plain HTML/CSS/vanilla JS, no framework, no bundler. Node.js only for the existing `blog/build-blog.js` script.

## Global Constraints

- Every existing English page keeps working byte-for-byte identically — no page moves, no ID/class renames, no behavior change for a visitor who never touches `/fr/`.
- `/fr` subdirectory, not a `.fr` domain (per the design spec).
- No silent auto-redirect based on detected language — detection only ever produces a dismissible banner offer.
- French pages keep the same filenames as their English counterparts, just under `/fr/` — this is what makes the language switcher a simple path-prefix toggle instead of a lookup table.
- Reuses existing `styles.css` custom properties only (`--coral`, `--peach`, `--radius-pill`, etc.) — no new design tokens, matching this repo's established convention (see `docs/superpowers/specs/2026-07-31-roi-calculator-section-design.md`).

---

### Task 1: Make `components.js`'s shared nav locale-aware

**Files:**
- Modify: `components.js`

**Interfaces:**
- Produces: any inner page can opt into the French nav by adding `data-locale="fr"` to its `<script src="../components.js" ...>` tag. No other file needs to know this happened — the injected `#navbar-root` markup is simply already correct.

- [ ] **Step 1: Read the current nav-building code**

Run: `grep -n "var base\|var navbarRoot\|navbarRoot.outerHTML" components.js` to confirm the exact current structure before editing (the nav is built as one large string-concatenation assigned to `navbarRoot.outerHTML`).

- [ ] **Step 2: Add a locale table and locale-prefixing helper**

Near the top of `components.js`, immediately after the existing `var base = script.getAttribute('data-base') || '..';` line, add:

```js
  var locale = script.getAttribute('data-locale') === 'fr' ? 'fr' : 'en';
  // Prefixes an English-tree relative link with the /fr equivalent when
  // this page is French. `base` already resolves "how many levels up to
  // the site root" — this only changes what sits AFTER that root.
  function localizeHref(href) {
    if (locale !== 'fr') return href;
    // href values here are always root-relative-from-base, e.g.
    // base + '/index.html' or base + '/solutions/x.html' — insert /fr
    // right after `base`.
    return href.replace(base, base + '/fr');
  }

  var NAV_STRINGS = {
    en: {
      math: 'The Math', howItWorks: 'How It Works', pricing: 'Pricing',
      grader: 'Free Store Grader', learn: 'Learn', contact: 'Contact',
      bookAudit: 'Book a CX Audit', startTrial: 'Start My Free Trial',
      solutionsCol: 'Solutions', resourcesCol: 'Resources', blogCol: 'Blog',
      shopifyGuideTitle: 'Shopify CX Guide', shopifyGuideDesc: 'Manage support on Shopify',
      cxStrategyTitle: 'CX Strategy', cxStrategyDesc: 'Build a CX playbook',
      wismoTitle: 'WISMO Automation', wismoDesc: 'Eliminate order tracking tickets',
      costsTitle: 'Cut Support Costs', costsDesc: '7 proven cost-saving tactics',
      templatesTitle: 'Response Templates', templatesDesc: 'Free copy-paste templates',
      metricsTitle: 'CX Metrics Guide', metricsDesc: '6 metrics that matter',
      allArticlesTitle: 'All Articles', allArticlesDesc: 'Latest CX insights & guides',
      switcherLabel: 'FR', switcherHref: null // filled in per-page, see Step 4
    },
    fr: {
      math: 'Le Calcul', howItWorks: 'Comment ça marche', pricing: 'Tarifs',
      grader: 'Auditez ma boutique', learn: 'Ressources', contact: 'Contact',
      bookAudit: 'Réserver un audit CX', startTrial: 'Essai gratuit',
      solutionsCol: 'Solutions', resourcesCol: 'Ressources', blogCol: 'Blog',
      shopifyGuideTitle: 'Guide CX Shopify', shopifyGuideDesc: 'Gérer le support sur Shopify',
      cxStrategyTitle: 'Stratégie CX', cxStrategyDesc: 'Construire un plan CX',
      wismoTitle: 'Automatisation WISMO', wismoDesc: 'Éliminer les tickets de suivi de commande',
      costsTitle: 'Réduire les coûts', costsDesc: '7 tactiques éprouvées',
      templatesTitle: 'Modèles de réponses', templatesDesc: 'Modèles gratuits à copier-coller',
      metricsTitle: 'Guide des métriques CX', metricsDesc: '6 métriques essentielles',
      allArticlesTitle: 'Tous les articles', allArticlesDesc: 'Derniers articles et guides CX',
      switcherLabel: 'EN', switcherHref: null
    }
  };
  var nav = NAV_STRINGS[locale];
```

- [ ] **Step 3: Replace every hardcoded nav label with `nav.*`, and every internal `href` with `localizeHref(...)`**

Locate each of these in the existing template-string nav (all currently under the `'<nav class="navbar" id="navbar">' + ...` concatenation) and apply the substitution:

| Current | Replace with |
|---|---|
| `'/index.html#problem">The Math'` | `localizeHref(base + '/index.html') + '#problem">' + nav.math` |
| `'/index.html#how-it-works">How It Works'` | `localizeHref(base + '/index.html') + '#how-it-works">' + nav.howItWorks` |
| `'/index.html#pricing">Pricing'` | `localizeHref(base + '/index.html') + '#pricing">' + nav.pricing` |
| `'/tools/cx-audit/index.html">Free Store Grader'` | `localizeHref(base + '/tools/cx-audit/index.html') + '">' + nav.grader` |
| `'Learn'` (dropdown trigger text) | `nav.learn` |
| `'Solutions'` (col title) | `nav.solutionsCol` |
| `'/solutions/shopify-customer-service.html"` + `'Shopify CX Guide'` + `'Manage support on Shopify'` | `localizeHref(base + '/solutions/shopify-customer-service.html') + '"'`, `nav.shopifyGuideTitle`, `nav.shopifyGuideDesc` |
| `'/solutions/ecommerce-cx-strategy.html"` + `'CX Strategy'` + `'Build a CX playbook'` | `localizeHref(base + '/solutions/ecommerce-cx-strategy.html') + '"'`, `nav.cxStrategyTitle`, `nav.cxStrategyDesc` |
| `'/solutions/wismo-automation.html"` + `'WISMO Automation'` + `'Eliminate order tracking tickets'` | `localizeHref(base + '/solutions/wismo-automation.html') + '"'`, `nav.wismoTitle`, `nav.wismoDesc` |
| `'Resources'` (col title) | `nav.resourcesCol` |
| `'/resources/reduce-support-costs.html"` + `'Cut Support Costs'` + `'7 proven cost-saving tactics'` | `localizeHref(base + '/resources/reduce-support-costs.html') + '"'`, `nav.costsTitle`, `nav.costsDesc` |
| `'/resources/customer-service-templates.html"` + `'Response Templates'` + `'Free copy-paste templates'` | `localizeHref(base + '/resources/customer-service-templates.html') + '"'`, `nav.templatesTitle`, `nav.templatesDesc` |
| `'/resources/cx-metrics-guide.html"` + `'CX Metrics Guide'` + `'6 metrics that matter'` | `localizeHref(base + '/resources/cx-metrics-guide.html') + '"'`, `nav.metricsTitle`, `nav.metricsDesc` |
| `'Blog'` (col title) | `nav.blogCol` |
| `'/blog/index.html"` + `'All Articles'` + `'Latest CX insights & guides'` | `localizeHref(base + '/blog/index.html') + '"'`, `nav.allArticlesTitle`, `nav.allArticlesDesc` |
| `'/index.html#contact">Contact'` | `localizeHref(base + '/index.html') + '#contact">' + nav.contact` |
| `'#contact" class="nav-cta-secondary">Book a CX Audit'` | keep `#contact` as-is (same-page anchor on inner pages resolves via the page's own contact section or mailto — unchanged, only the label changes) `>' + nav.bookAudit` |
| `'#contact" class="nav-cta">Start My Free Trial'` | `>' + nav.startTrial` |

Apply the identical substitutions to the mobile `#navLinks` duplicate block further down in the same template string (same label/href pairs, repeated for the slide-out menu — grep for `mobile-dropdown-items` to find it).

- [ ] **Step 4: Add the language-switcher link**

Every page that includes `components.js` already knows its own French/English counterpart exists at the identical path under (or stripped of) `/fr` — so the switcher doesn't need a lookup table, just a path transform on the *current* URL. Immediately before the closing `</div>` of `nav-right` in the template string, add:

```js
        '<a href="' + (locale === 'fr'
          ? window.location.pathname.replace('/fr/', '/')
          : window.location.pathname.replace(/^(\/)?/, '$1fr/')
        ) + '" class="nav-lang-switch" aria-label="' + (locale === 'fr' ? 'Switch to English' : 'Passer en français') + '">' + nav.switcherLabel + '</a>' +
```

- [ ] **Step 5: Add minimal CSS for `.nav-lang-switch`**

In `styles.css`, near the other `.nav-cta*` rules (search `grep -n "\.nav-cta" styles.css` to find them), add:

```css
.nav-lang-switch {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink-60, #666);
  border: 1px solid currentColor;
  border-radius: var(--radius-pill);
  padding: 4px 10px;
  margin-left: 8px;
  text-decoration: none;
}
.nav-lang-switch:hover { color: var(--coral); border-color: var(--coral); }
```

- [ ] **Step 6: Manual verification**

1. `node -c components.js` — confirms no syntax errors.
2. Open `solutions/wismo-automation.html` in a browser (existing page, `data-locale` not yet set anywhere) — nav must render byte-identical to before this change (English labels, English hrefs, no switcher pointing at a 404 `/fr/solutions/wismo-automation.html` yet — that's fine, Task 6 creates the target).
3. This task alone doesn't yet have any HTML file passing `data-locale="fr"`, so there's nothing French-rendering to check yet — that's verified in Task 6/7 once `/fr` pages exist and reference this script.

- [ ] **Step 7: Commit**

```bash
git add components.js styles.css
git commit -m "feat: make the shared nav locale-aware for French pages"
```

---

### Task 2: Language-detection banner

**Files:**
- Modify: `script.js` (append to the existing `DOMContentLoaded` handler), `styles.css`

**Interfaces:**
- Produces: a dismissible banner shown on English pages to visitors whose browser language suggests French, and vice versa on French pages. Cookie name `agoracrew_lang_pref` is the single source of truth other scripts could later read (none do yet).

- [ ] **Step 1: Add the banner logic to `script.js`**

Inside the existing `document.addEventListener('DOMContentLoaded', () => { ... })` block (see `script.js:5`), add, following the file's existing plain-vanilla-JS style:

```js
  // ── Language banner ──────────────────────────
  // Suggests switching language based on browser locale; never
  // auto-redirects (bad for SEO crawlability and for VPN/expat users).
  // Cookie-remembered dismissal so it doesn't nag on every pageview.
  (function () {
    var COOKIE_NAME = 'agoracrew_lang_pref';
    var currentLocale = document.documentElement.lang === 'fr' ? 'fr' : 'en';

    function getCookie(name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
    function setCookie(name, value) {
      document.cookie = name + '=' + value + ';path=/;max-age=' + (60 * 60 * 24 * 365);
    }

    if (getCookie(COOKIE_NAME)) return; // already dismissed or already chose, either language

    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    var suggestFrench = currentLocale === 'en' && browserLang.indexOf('fr') === 0;
    var suggestEnglish = currentLocale === 'fr' && browserLang.indexOf('fr') !== 0;
    if (!suggestFrench && !suggestEnglish) return;

    var banner = document.createElement('div');
    banner.className = 'lang-banner';
    var text = document.createElement('span');
    text.textContent = suggestFrench
      ? "On dirait que vous préférez le français."
      : "It looks like you might prefer English.";
    var switchLink = document.createElement('a');
    switchLink.href = suggestFrench
      ? window.location.pathname.replace(/^(\/)?/, '$1fr/')
      : window.location.pathname.replace('/fr/', '/');
    switchLink.textContent = suggestFrench ? 'Voir en français' : 'View in English';
    switchLink.addEventListener('click', function () { setCookie(COOKIE_NAME, suggestFrench ? 'fr' : 'en'); });
    var dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss');
    dismiss.textContent = '✕';
    dismiss.addEventListener('click', function () {
      setCookie(COOKIE_NAME, currentLocale);
      banner.remove();
    });

    banner.appendChild(text);
    banner.appendChild(switchLink);
    banner.appendChild(dismiss);
    document.body.appendChild(banner);
  })();
```

- [ ] **Step 2: Add banner CSS**

In `styles.css`, add:

```css
.lang-banner {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 420px;
  margin: 0 auto;
  background: var(--white);
  border: 1px solid var(--peach);
  border-radius: var(--radius-md, 12px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1002;
  font-size: 0.9rem;
}
.lang-banner a {
  color: var(--coral);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}
.lang-banner button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  color: var(--ink-60, #666);
  padding: 0;
  margin-left: auto;
}
```

- [ ] **Step 3: Manual verification**

Since this depends on `navigator.language`, verify by temporarily overriding it in a browser console on the live page: `Object.defineProperty(navigator, 'language', {value: 'fr-FR'})` then reload-equivalent by re-running the IIFE, or use browser devtools' network-conditions language override. Confirm: banner appears once, dismiss button sets the cookie and removes it, reloading the page after dismissal shows no banner.

- [ ] **Step 4: Commit**

```bash
git add script.js styles.css
git commit -m "feat: add detect-and-prompt language banner"
```

---

### Task 3: `hreflang` tag pattern

**Files:**
- Modify: `index.html` (add tags now, as the first mirrored pair)

**Interfaces:**
- Produces: the exact `<link>` block every future page pair (Task 4 onward) copies verbatim, substituting only the path.

- [ ] **Step 1: Add hreflang tags to `index.html`'s `<head>`**

Immediately after the existing `<meta property="og:type" content="website" />` line, add:

```html
  <link rel="alternate" hreflang="en" href="https://agoracrew.com/index.html" />
  <link rel="alternate" hreflang="fr" href="https://agoracrew.com/fr/index.html" />
  <link rel="alternate" hreflang="x-default" href="https://agoracrew.com/index.html" />
```

- [ ] **Step 2: Verify**

`grep -c "hreflang" index.html` → expect `3`. This exact 3-line block (with the path substituted) is what Task 4 and Task 6 add to every other page pair — noted here once rather than repeated per task.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add hreflang tags to homepage (pattern for all page pairs)"
```

---

### Task 4: Create `/fr/index.html`

**Files:**
- Create: `fr/index.html`

**Interfaces:**
- Consumes: `components.js`'s `data-locale="fr"` support (Task 1) — n/a here since the homepage uses its own inline nav, not `components.js` (see Task 1's Step 6 note); the language-switcher link (Task 1, Step 4) and banner (Task 2) are homepage-external files, no homepage-side wiring needed for those beyond including the same `<script src="script.js">` tag the English homepage already has.

- [ ] **Step 1: Copy the file and fix root-relative paths**

`index.html` uses root-relative-from-page paths like `href="solutions/..."`, `src="script.js"`, `src="styles.css"` (no leading `/`, no `../`, since it lives at the site root). Living one level deeper at `fr/index.html`, every such relative reference needs a `../` prefix — but internal same-page anchors (`href="#problem"`) and the nav's `href="#"` logo link do not.

Copy `index.html` to `fr/index.html`, then:
1. Change `<html lang="en">` to `<html lang="fr">`.
2. Prefix every `href`/`src` that points at a sibling file or directory (`styles.css`, `script.js`, `components.js` if referenced, `solutions/...`, `resources/...`, `blog/...`, `tools/cx-audit/...`, any image paths) with `../`. Do NOT prefix `#`-only anchors or `https://` absolute URLs (Google Fonts links, `mailto:`, etc.).
3. Replace the three `hreflang` tags (Task 3) with:
```html
  <link rel="alternate" hreflang="en" href="https://agoracrew.com/index.html" />
  <link rel="alternate" hreflang="fr" href="https://agoracrew.com/fr/index.html" />
  <link rel="alternate" hreflang="x-default" href="https://agoracrew.com/index.html" />
```
(Same block, no path substitution needed — both point at absolute URLs already.)
4. Update `<title>` and the `description`/`og:title`/`og:description` meta tags to French equivalents (see Step 2 for the specific text).
5. Translate the inline nav block's labels and hrefs using the exact same `NAV_STRINGS.fr` values and `localizeHref`-equivalent path logic defined in Task 1 — since this nav is hand-written HTML, not JS-generated, write the French labels directly and prefix every internal href with `../` (per Step 1.2) rather than `/fr` (this file IS the `/fr` version, so its links to siblings need to point at ITS OWN `../fr/...` siblings, e.g. `href="solutions/shopify-customer-service.html"` in the English source becomes `href="../fr/solutions/shopify-customer-service.html"` here). Add the language-switcher link (`EN`, linking to `../index.html`) in the same position Task 1 Step 4 placed it for the JS-generated nav, for visual consistency between the homepage and inner pages.
6. Add the language banner's script include if not already present via the existing `<script src="script.js">` tag (it should already be present — the homepage already includes `script.js`, so Task 2's banner code runs automatically; no new include needed).

- [ ] **Step 2: Translate the visible body copy**

Translate every human-readable text node and translatable attribute (`alt`, `title`, `aria-label`, `placeholder`) in the body from English to French, using `index.html` as the source of truth for structure. Do not change: element tags, `class`/`id` attributes, `data-*` attributes consumed by `script.js` (e.g. the ROI calculator's slider min/max/step/default values and any `data-` hooks it reads), inline `<svg>` markup, or JS `<script>` block contents. This includes the hero headline/subhead, the ROI calculator section's labels (inputs, output panel labels, stat cards, per `docs/superpowers/specs/2026-07-31-roi-calculator-section-design.md`), "How It Works" steps, pricing tier names/descriptions (keep prices themselves in USD — currency-per-market for the website's own pricing display is out of scope for this plan, matching the design spec's Non-goals; only Project Control's dashboard billing UI gets EUR formatting), testimonials/proof section, and footer.

- [ ] **Step 3: Verify structural parity**

Run: `grep -o 'id="[^"]*"' index.html | sort > /tmp/en-ids.txt` and `grep -o 'id="[^"]*"' fr/index.html | sort > /tmp/fr-ids.txt` (adjust temp paths to the scratchpad directory), then `diff /tmp/en-ids.txt /tmp/fr-ids.txt` — expect **no diff**. Every `id` that exists in the English page (many are targeted by `script.js`, e.g. the ROI calculator's slider/output element IDs) must exist, unchanged, in the French page, or the calculator and other interactive sections will silently break.

- [ ] **Step 4: Manual browser check**

Open `fr/index.html` directly in a browser. Confirm: page renders with French copy, nav links resolve (no 404s to pages that don't exist yet — solutions/resources/blog `/fr` targets are created in Tasks 6-7, so those specific links 404 until then; that's expected and fine at this point in the plan), the ROI calculator still functions (drag a slider, confirm the output numbers update — proves the `id`-parity check in Step 3 actually worked, not just that it diffed clean).

- [ ] **Step 5: Commit**

```bash
git add fr/index.html
git commit -m "feat: add French homepage (/fr/index.html)"
```

---

### Task 5: `robots.txt` and crawlability check

**Files:**
- Verify only: `robots.txt`

**Interfaces:** none — this is a verification-only task.

- [ ] **Step 1: Confirm no change needed**

`robots.txt` currently reads `User-agent: * / Allow: /` with no path exclusions — `/fr/` is already crawlable under the existing blanket `Allow: /`. Run `cat robots.txt` to confirm this is still true (hasn't changed since this plan started) and take no action. (No `sitemap.xml` file exists in this repo despite `robots.txt` referencing one — that's a pre-existing gap unrelated to this plan; out of scope to fix here.)

- [ ] **Step 2: Commit**

No commit — no file changed. Skip.

---

### Task 6: Mirror solutions, resources, and privacy-policy pages into `/fr/`

**Files:**
- Create: `fr/solutions/shopify-customer-service.html`, `fr/solutions/ecommerce-cx-strategy.html`, `fr/solutions/wismo-automation.html`, `fr/resources/reduce-support-costs.html`, `fr/resources/customer-service-templates.html`, `fr/resources/cx-metrics-guide.html`, `fr/privacy-policy.html`
- Modify: each corresponding English source file, to add its `hreflang` pair (Task 3's pattern) and, for the 6 `solutions`/`resources` pages, confirm their `components.js` include gets a sibling `data-locale="fr"` copy

**Interfaces:**
- Consumes: `components.js`'s locale-aware nav (Task 1) — these 7 pages use the shared injected nav (`<div id="navbar-root"></div>` + `<script src="../components.js" data-base="..">`), unlike the homepage's inline nav, so Task 1 already covers their nav translation. No per-page nav work needed here beyond setting the right `data-base` and `data-locale`.

- [ ] **Step 1: For each of the 7 English source files, add its hreflang pair**

Using `solutions/wismo-automation.html` as the worked example (repeat identically for the other 6, substituting the path):

Add, in the `<head>`, alongside the existing meta tags:
```html
  <link rel="alternate" hreflang="en" href="https://agoracrew.com/solutions/wismo-automation.html" />
  <link rel="alternate" hreflang="fr" href="https://agoracrew.com/fr/solutions/wismo-automation.html" />
  <link rel="alternate" hreflang="x-default" href="https://agoracrew.com/solutions/wismo-automation.html" />
```

- [ ] **Step 2: For each of the 7 pages, create the `/fr/` counterpart**

Using `solutions/wismo-automation.html` → `fr/solutions/wismo-automation.html` as the worked example (repeat identically for the other 6):

1. Copy the file to the mirrored path under `fr/`.
2. Change `<html lang="en">` to `<html lang="fr">`.
3. Because the French copy lives one directory deeper (`fr/solutions/...` vs `solutions/...`), every relative path needs one more `../`: `href="../styles.css"` becomes `href="../../styles.css"`, and the `components.js` include's `data-base=".."` becomes `data-base="../.."` (one more level up to reach the site root) — and add `data-locale="fr"` to that same `<script>` tag: `<script src="../../components.js" data-base="../.." data-locale="fr"></script>`.
4. Add the hreflang block from Step 1 (same 3 lines, no path change needed — both already absolute URLs).
5. Update `<title>` and meta `description` to French.
6. Translate all body copy per the same rule as Task 4 Step 2 (translate text nodes and translatable attributes; leave structure, classes, ids, and any script-referenced hooks unchanged).
7. For `fr/privacy-policy.html` specifically: also keep `<meta name="robots" content="noindex, follow" />` as-is (privacy policy is intentionally not indexed in either language) and update the `<title>`/description to French equivalents ("Politique de confidentialité — AgoraCrew").

- [ ] **Step 3: Verify structural parity per page**

For each of the 7 pairs, run the same `id`-diff check as Task 4 Step 3 (`grep -o 'id="[^"]*"' <en-file> | sort` vs the `fr` counterpart) — expect no diff. These pages are simpler than the homepage (no ROI calculator), so this mainly guards against accidentally dropping an `id` used by `components.js`'s `#navbar-root` target or any per-page interactive element (e.g. blog's `#navbar-root`, or resources pages' template copy-buttons, if any — check each file for `id=` usage before translating).

- [ ] **Step 4: Manual verification**

Open each new `/fr/` page directly in a browser. Confirm: nav renders in French (proves Task 1's `data-locale="fr"` wiring works end-to-end, not just in isolation), language-switcher link in the nav points back at the correct English sibling, no console errors.

- [ ] **Step 5: Commit**

```bash
git add solutions/ resources/ privacy-policy.html fr/solutions/ fr/resources/ fr/privacy-policy.html
git commit -m "feat: mirror solutions, resources, and privacy-policy pages into /fr"
```

---

### Task 7: French blog

**Files:**
- Modify: `blog/build-blog.js`
- Create: `blog/posts/fr/` (directory), `blog/posts/fr/when-to-outsource-shopify-support.md`, `fr/blog/index.html`, `fr/blog/post.html`

**Interfaces:**
- Consumes: nothing new.
- Produces: `node blog/build-blog.js --lang=fr` generates `blog/posts.fr.json` from `blog/posts/fr/*.md`, mirroring exactly what a bare `node blog/build-blog.js` already does for `blog/posts/*.md` → `blog/posts.json`.

- [ ] **Step 1: Parameterize `build-blog.js`**

Read the current `POSTS_DIR`/`OUTPUT_FILE` constants (`blog/build-blog.js:18-19`) and the CLI entry point at the bottom of the file (`grep -n "process.argv\|require.main" blog/build-blog.js` to locate it, if present, otherwise the script just runs top-to-bottom on require). Change:

```js
const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_FILE = path.join(__dirname, 'posts.json');
```

to:

```js
const langArg = process.argv.find(a => a.startsWith('--lang='));
const lang = langArg ? langArg.split('=')[1] : 'en';
const POSTS_DIR = lang === 'en' ? path.join(__dirname, 'posts') : path.join(__dirname, 'posts', lang);
const OUTPUT_FILE = lang === 'en' ? path.join(__dirname, 'posts.json') : path.join(__dirname, `posts.${lang}.json`);
```

This keeps `node build-blog.js` (no args) producing byte-identical output to today (`lang` defaults to `'en'`, same `POSTS_DIR`/`OUTPUT_FILE` as before) — no regression for the existing English blog.

- [ ] **Step 2: Create the French posts directory and translate the one existing post**

Create `blog/posts/fr/when-to-outsource-shopify-support.md`, copying the frontmatter structure of `blog/posts/when-to-outsource-shopify-support.md` exactly (same YAML keys), translating the frontmatter's `title`/`description`/any other human-readable frontmatter values and the full markdown body to French. Keep the `slug`/filename identical (matches this plan's site-wide "same filename under /fr" rule from the header).

- [ ] **Step 3: Generate `posts.fr.json` and verify**

Run: `node blog/build-blog.js --lang=fr`
Expected: creates `blog/posts.fr.json` with one entry, structurally identical (same JSON keys) to an entry in the existing `blog/posts.json`.

Run: `node blog/build-blog.js` (no args, re-run the existing behavior)
Expected: `blog/posts.json` is unchanged (byte-identical to before this task) — confirms Step 1's default-argument backward-compatibility.

- [ ] **Step 4: Create the French blog index and post-template pages**

Copy `blog/index.html` → `fr/blog/index.html` and `blog/post.html` → `fr/blog/post.html`, applying the same path-depth (`../` prefixing per Task 4/6's rule — these live at `fr/blog/`, same depth as `blog/`, one level under site root, so the `../` count matches the English originals exactly, just rooted differently), `data-locale="fr"` on the `components.js` include, `hreflang` block, and body-copy translation rules as Task 6. Additionally, find where `blog/blog.js` (or inline script in `blog/index.html`/`post.html`) fetches `posts.json` (`grep -n "posts.json" blog/blog.js blog/index.html blog/post.html`) and confirm the French pages' copy of that fetch call points at `posts.fr.json` instead — adjust the fetch URL accordingly in `fr/blog/index.html`/`fr/blog/post.html`'s script reference (or in a French-specific small inline override if the fetch logic lives in the shared `blog.js` and needs a locale check — apply the same `document.documentElement.lang === 'fr'` detection pattern used in Task 2's banner to pick `posts.fr.json` vs `posts.json` if `blog.js` is shared rather than duplicated).

- [ ] **Step 5: Verify**

Open `fr/blog/index.html` in a browser — confirm the one French post is listed, clicking through to it renders the translated content via `fr/blog/post.html`.

- [ ] **Step 6: Commit**

```bash
git add blog/build-blog.js blog/posts/fr/ blog/posts.fr.json fr/blog/
git commit -m "feat: add French blog (posts, index, post template)"
```

---

### Task 8: CX audit tool French version

**Files:**
- Modify: `tools/cx-audit/audit.js`
- Create: `fr/tools/cx-audit/index.html`

**Interfaces:**
- Consumes: `document.documentElement.lang` (same detection pattern as Task 7 Step 4).

- [ ] **Step 1: Externalize `audit.js`'s status strings**

At the top of `tools/cx-audit/audit.js`, add:

```js
const AUDIT_STRINGS = {
  en: {
    scanning: 'Scanning your store…',
    genericError: 'Couldn’t reach the audit service. Please try again shortly.',
    sending: 'Sending…',
    sent: 'Sent! Check your inbox for the full report.',
    emailFailed: 'The report couldn’t be emailed right now — please try again later.',
    emailInvalid: 'Couldn’t send the report — please double-check your email and try again.'
  },
  fr: {
    scanning: 'Analyse de votre boutique en cours…',
    genericError: 'Impossible de contacter le service d’audit. Merci de réessayer sous peu.',
    sending: 'Envoi en cours…',
    sent: 'Envoyé ! Consultez votre boîte de réception pour le rapport complet.',
    emailFailed: 'Le rapport n’a pas pu être envoyé pour le moment — merci de réessayer plus tard.',
    emailInvalid: 'Impossible d’envoyer le rapport — merci de vérifier votre adresse e-mail et de réessayer.'
  }
};
const auditLocale = document.documentElement.lang === 'fr' ? 'fr' : 'en';
const t = AUDIT_STRINGS[auditLocale];
```

Then replace each hardcoded string (`audit.js:27,38,45,65,72,82,84,86`) with its `t.*` equivalent, e.g. line 27's `statusEl.textContent = 'Scanning your store…';` becomes `statusEl.textContent = t.scanning;`. Line 38's error branching (`data.error === 'invalid_url' ? ... : ...`) keeps its conditional structure, only the two branch strings become `t.*` lookups — read the surrounding lines first (`grep -n -A3 "data.error === 'invalid_url'" tools/cx-audit/audit.js`) to preserve the exact branch you're editing.

- [ ] **Step 2: Create `fr/tools/cx-audit/index.html`**

Copy `tools/cx-audit/index.html` → `fr/tools/cx-audit/index.html`. Apply: `<html lang="fr">`, `../../` path prefixing (two levels — `fr/tools/cx-audit/` is 3 deep, same as `tools/cx-audit/` is 2 deep plus the extra `fr` level), `data-locale="fr"` on the nav include if this page uses `components.js` (check first: `grep -n "components.js" tools/cx-audit/index.html`), hreflang block, translated title/meta/body copy, and confirm it references the same (now locale-aware) `audit.js` — no duplicate JS file needed since Step 1 made `audit.js` itself locale-aware via `document.documentElement.lang`.

- [ ] **Step 3: Verify**

`node -c tools/cx-audit/audit.js` — no syntax errors. Open `fr/tools/cx-audit/index.html` in a browser, run an audit against a test store URL, confirm status messages render in French.

- [ ] **Step 4: Commit**

```bash
git add tools/cx-audit/audit.js fr/tools/cx-audit/
git commit -m "feat: add French CX audit tool page and localize its status strings"
```

---

### Task 9: Legal pages (mentions légales, CGV) — blocked on user-supplied text

**Files:**
- Create: `fr/mentions-legales.html`, `fr/cgv.html`

**Interfaces:** none.

**This task cannot be completed until the user supplies the French mentions légales and CGV text they're drafting (per the design spec's Non-goals: no lawyer-drafted content, user is writing this directly).** Do not fabricate placeholder legal text — an incorrect or fake legal notice is worse than a missing page. When the text is available:

- [ ] **Step 1: Build the page shell from the `privacy-policy.html` structure**

Copy `fr/privacy-policy.html` (created in Task 6) as the structural template for both new pages — same `<head>` pattern (`<meta name="robots" content="noindex, follow" />`, same stylesheet link, same favicon), same body wrapper/typography classes, so the legal pages look visually consistent with the existing privacy policy rather than introducing new layout patterns.

- [ ] **Step 2: Insert the supplied text verbatim**

Insert the user-provided French mentions légales text into `fr/mentions-legales.html` and CGV text into `fr/cgv.html`, inside the same content-wrapper element `privacy-policy.html` uses (check `grep -n "class=\"legal\|class=\"policy\|<main" privacy-policy.html` for the exact wrapper class to reuse). Set `<title>` to "Mentions légales — AgoraCrew" and "Conditions Générales de Vente — AgoraCrew" respectively.

- [ ] **Step 3: Link them from the French footer**

Locate the footer's privacy-policy link (present in every page via `components.js` or, on the homepage, inline — `grep -rn "privacy-policy.html" components.js index.html`) and add adjacent links to the two new pages, French-locale-nav only (English pages don't get these links — they're not relevant there, matching this plan's "no change to English experience" constraint).

- [ ] **Step 4: Commit**

```bash
git add fr/mentions-legales.html fr/cgv.html components.js
git commit -m "feat: add French mentions légales and CGV pages"
```

---

## Self-review notes

- **Spec coverage:** `/fr` routes for every existing page (Tasks 4/6/7/8), hreflang (Task 3, applied throughout 4/6/7/8), language banner (Task 2), legal pages (Task 9, explicitly blocked pending the user's text rather than faked), sitemap/meta translation (folded into each page task's Step "update title/description"). Website's Non-goal "no `.fr` ccTLD" — satisfied by construction (everything is `/fr/...` under the existing domain).
- **Ambiguity resolved during planning:** the design spec didn't specify whether French URLs get translated slugs or keep English filenames under `/fr/`. This plan commits to keeping filenames identical (stated in Global Constraints) — simpler switcher logic, no SEO cost since hreflang (not the slug) is the signal Google uses.
- **Type/pattern consistency:** every content-translation task (4, 6, 7, 8) uses the identical rule ("translate text nodes and translatable attributes, preserve structure/ids/classes/script hooks, verify with an id-diff") rather than restating bespoke instructions per file — and every locale-detection point in JS (banner in Task 2, blog fetch in Task 7, audit strings in Task 8) uses the same `document.documentElement.lang === 'fr'` check, not three different mechanisms.
