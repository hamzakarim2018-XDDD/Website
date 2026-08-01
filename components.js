/**
 * AgoraCrew — Reusable Component Injector
 * Injects consistent navbar and footer into all inner pages.
 *
 * Usage (from any page one level deep, e.g. /solutions/page.html):
 *   <div id="navbar-root"></div>
 *   ...page content...
 *   <div id="footer-root"></div>
 *   <script src="../components.js" data-base=".."></script>
 */

(function () {
  var script = document.currentScript;
  var base = script.getAttribute('data-base') || '..';
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
      bookAudit: 'Book a CX Audit', startTrial: 'Start Free Trial',
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

  /* ==================== NAVBAR ==================== */
  var navbarRoot = document.getElementById('navbar-root');
  if (navbarRoot) {
    navbarRoot.outerHTML =
      '<nav class="navbar" id="navbar">' +
        '<div class="container">' +
          '<a href="' + localizeHref(base + '/index.html') + '" class="nav-logo" aria-label="AgoraCrew">' +
            '<span class="nav-logo-icon"></span>' +
          '</a>' +

          '<div class="nav-center" id="navCenter">' +
            '<a href="' + localizeHref(base + '/index.html') + '#problem">' + nav.math + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#how-it-works">' + nav.howItWorks + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#pricing">' + nav.pricing + '</a>' +
            '<a href="' + localizeHref(base + '/tools/cx-audit/index.html') + '">' + nav.grader + '</a>' +
            '<div class="nav-dropdown">' +
              '<button class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">' +
                nav.learn +
                '<svg class="nav-dropdown-arrow" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</button>' +
              '<div class="nav-dropdown-menu">' +
                '<div class="nav-dropdown-col">' +
                  '<div class="nav-dropdown-col-title">' + nav.solutionsCol + '</div>' +
                  '<a href="' + localizeHref(base + '/solutions/shopify-customer-service.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.shopifyGuideTitle + '</span><span class="nav-dropdown-link-desc">' + nav.shopifyGuideDesc + '</span></span>' +
                  '</a>' +
                  '<a href="' + localizeHref(base + '/solutions/ecommerce-cx-strategy.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.cxStrategyTitle + '</span><span class="nav-dropdown-link-desc">' + nav.cxStrategyDesc + '</span></span>' +
                  '</a>' +
                  '<a href="' + localizeHref(base + '/solutions/wismo-automation.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.wismoTitle + '</span><span class="nav-dropdown-link-desc">' + nav.wismoDesc + '</span></span>' +
                  '</a>' +
                '</div>' +
                '<div class="nav-dropdown-col">' +
                  '<div class="nav-dropdown-col-title">' + nav.resourcesCol + '</div>' +
                  '<a href="' + localizeHref(base + '/resources/reduce-support-costs.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.costsTitle + '</span><span class="nav-dropdown-link-desc">' + nav.costsDesc + '</span></span>' +
                  '</a>' +
                  '<a href="' + localizeHref(base + '/resources/customer-service-templates.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.templatesTitle + '</span><span class="nav-dropdown-link-desc">' + nav.templatesDesc + '</span></span>' +
                  '</a>' +
                  '<a href="' + localizeHref(base + '/resources/cx-metrics-guide.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.metricsTitle + '</span><span class="nav-dropdown-link-desc">' + nav.metricsDesc + '</span></span>' +
                  '</a>' +
                '</div>' +
                '<div class="nav-dropdown-col">' +
                  '<div class="nav-dropdown-col-title">' + nav.blogCol + '</div>' +
                  '<a href="' + localizeHref(base + '/blog/index.html') + '" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">' + nav.allArticlesTitle + '</span><span class="nav-dropdown-link-desc">' + nav.allArticlesDesc + '</span></span>' +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact">' + nav.contact + '</a>' +
          '</div>' +

          '<div class="nav-right">' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact" class="nav-cta-secondary">' + nav.bookAudit + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact" class="nav-cta">' + nav.startTrial + '</a>' +
            '<a href="' + (locale === 'fr'
              ? window.location.pathname.replace('/fr/', '/')
              : window.location.pathname.replace(/^(\/)?/, '$1fr/')
            ) + '" class="nav-lang-switch" aria-label="' + (locale === 'fr' ? 'Switch to English' : 'Passer en français') + '">' + nav.switcherLabel + '</a>' +
          '</div>' +

          '<button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +

          '<div class="nav-links" id="navLinks">' +
            '<a href="' + localizeHref(base + '/index.html') + '#problem">' + nav.math + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#how-it-works">' + nav.howItWorks + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#pricing">' + nav.pricing + '</a>' +
            '<a href="' + localizeHref(base + '/tools/cx-audit/index.html') + '">' + nav.grader + '</a>' +
            '<button class="mobile-dropdown-toggle" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">' +
              nav.learn +
              '<svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<div class="mobile-dropdown-items">' +
              '<a href="' + localizeHref(base + '/solutions/shopify-customer-service.html') + '">' + nav.shopifyGuideTitle + '</a>' +
              '<a href="' + localizeHref(base + '/solutions/ecommerce-cx-strategy.html') + '">' + nav.cxStrategyTitle + '</a>' +
              '<a href="' + localizeHref(base + '/solutions/wismo-automation.html') + '">' + nav.wismoTitle + '</a>' +
              '<a href="' + localizeHref(base + '/resources/reduce-support-costs.html') + '">' + nav.costsTitle + '</a>' +
              '<a href="' + localizeHref(base + '/resources/customer-service-templates.html') + '">' + nav.templatesTitle + '</a>' +
              '<a href="' + localizeHref(base + '/resources/cx-metrics-guide.html') + '">' + nav.metricsTitle + '</a>' +
              '<a href="' + localizeHref(base + '/blog/index.html') + '">' + nav.blogCol + '</a>' +
            '</div>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact">' + nav.contact + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact" class="nav-cta">' + nav.startTrial + '</a>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  /* ==================== FOOTER ==================== */
  var footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.outerHTML =
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +

            /* Brand Column */
            '<div class="footer-brand">' +
              '<a href="' + base + '/index.html" class="nav-logo" aria-label="AgoraCrew">' +
                '<span class="nav-logo-icon"></span>' +
              '</a>' +
              '<p>Trained AI agents with supervised human backup for e-commerce brands. Flat monthly plans from $99/mo — WISMO resolution, cart recovery, and 24/7 support that scales with your store.</p>' +
            '</div>' +

            /* Solutions Column */
            '<div class="footer-col">' +
              '<h4>Solutions</h4>' +
              '<a href="' + base + '/solutions/shopify-customer-service.html">Shopify Customer Service</a>' +
              '<a href="' + base + '/solutions/ecommerce-cx-strategy.html">E-Commerce CX Strategy</a>' +
              '<a href="' + base + '/solutions/wismo-automation.html">WISMO Automation</a>' +
            '</div>' +

            /* Resources Column */
            '<div class="footer-col">' +
              '<h4>Resources</h4>' +
              '<a href="' + base + '/resources/reduce-support-costs.html">Reduce Support Costs</a>' +
              '<a href="' + base + '/resources/customer-service-templates.html">Response Templates</a>' +
              '<a href="' + base + '/resources/cx-metrics-guide.html">CX Metrics Guide</a>' +
              '<a href="' + base + '/blog/index.html">Blog</a>' +
            '</div>' +

            /* Contact Column */
            '<div class="footer-col footer-col--contact">' +
              '<h4>Get In Touch</h4>' +
              '<a href="mailto:anne@agoracrew.com">anne@agoracrew.com</a>' +
              '<a href="tel:+36300841533">+36 30 084 1533</a>' +
              '<a href="' + base + '/index.html#contact">Book a free CX Audit</a>' +
            '</div>' +

          '</div>' +

          /* Bottom Bar */
          '<div class="footer-bottom">' +
            '<span>&copy; 2026 AgoraCrew. All rights reserved.</span>' +
            '<span class="footer-tax-id">Tax ID (Adószám): HU92198362</span>' +
            '<div class="footer-bottom-links">' +
              '<a href="' + base + '/privacy-policy.html">Privacy Policy</a>' +
              '<a href="#">Terms of Service</a>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</footer>';
  }

  /* ==================== NAVBAR SCROLL EFFECT ==================== */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ==================== MOBILE MENU ==================== */
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      var spans = mobileMenuBtn.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        var spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  /* ==================== SCROLL REVEAL ==================== */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  }

})();
