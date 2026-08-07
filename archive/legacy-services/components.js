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

  // Computes the URL for the "other" language, preserving the current
  // page's path AND query string (e.g. blog post pages use ?slug=...,
  // which must survive a language switch or the target page 404s/errors).
  function otherLangUrl() {
    var path = locale === 'fr'
      ? window.location.pathname.replace('/fr/', '/')
      : window.location.pathname.replace(/^(\/)?/, '$1fr/');
    return path + window.location.search;
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
      switcherLabel: 'FR'
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
      switcherLabel: 'EN'
    }
  };
  var nav = NAV_STRINGS[locale];

  var FOOTER_STRINGS = {
    en: {
      tagline: 'Trained AI agents with supervised human backup for e-commerce brands. Flat monthly plans from $99/mo — WISMO resolution, cart recovery, and 24/7 support that scales with your store.',
      solutionsCol: 'Solutions', resourcesCol: 'Resources', contactCol: 'Get In Touch',
      shopifyService: 'Shopify Customer Service', cxStrategy: 'E-Commerce CX Strategy', wismo: 'WISMO Automation',
      reduceCosts: 'Reduce Support Costs', templates: 'Response Templates', metrics: 'CX Metrics Guide', blog: 'Blog',
      bookAudit: 'Book a free CX Audit', privacy: 'Privacy Policy', terms: 'Terms of Service',
      copyright: '© 2026 AgoraCrew. All rights reserved.', taxId: 'Tax ID (Adószám): HU92198362'
    },
    fr: {
      tagline: 'Des agents IA formés, avec renfort humain supervisé, pour les marques e-commerce. Forfaits mensuels fixes dès 99 €/mois — résolution des demandes de suivi de commande, récupération de paniers abandonnés, et support 24h/24 et 7j/7 qui s\'adapte à votre boutique.',
      solutionsCol: 'Solutions', resourcesCol: 'Ressources', contactCol: 'Nous contacter',
      shopifyService: 'Service client Shopify', cxStrategy: 'Stratégie CX e-commerce', wismo: 'Automatisation WISMO',
      reduceCosts: 'Réduire les coûts de support', templates: 'Modèles de réponses', metrics: 'Guide des métriques CX', blog: 'Blog',
      bookAudit: 'Réserver un audit CX gratuit', privacy: 'Politique de confidentialité', terms: 'CGV', mentionsLegales: 'Mentions légales',
      copyright: '© 2026 AgoraCrew. Tous droits réservés.', taxId: 'Numéro fiscal (Adószám) : HU92198362'
    }
  };
  var footer = FOOTER_STRINGS[locale];

  /* ==================== NAVBAR ==================== */
  var navbarRoot = document.getElementById('navbar-root');
  if (navbarRoot) {
    navbarRoot.outerHTML =
      '<nav class="navbar" id="navbar">' +
        '<div class="container">' +
          '<a href="' + localizeHref(base + '/index.html') + '" class="nav-logo" aria-label="AgoraCrew">' +
            '<img src="' + base + '/logo-new-orange.png" alt="AgoraCrew" class="nav-logo-img" width="120" height="36" />' +
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
            '<a href="' + otherLangUrl() + '" class="nav-lang-switch" aria-label="' + (locale === 'fr' ? 'Switch to English' : 'Passer en français') + '">' + nav.switcherLabel + '</a>' +
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
            '<a href="' + otherLangUrl() + '" class="nav-lang-switch-mobile" aria-label="' + (locale === 'fr' ? 'Switch to English' : 'Passer en français') + '">' + nav.switcherLabel + '</a>' +
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
              '<a href="' + localizeHref(base + '/index.html') + '" class="nav-logo" aria-label="AgoraCrew">' +
                '<img src="' + base + '/logo-new-orange.png" alt="AgoraCrew" class="nav-logo-img" width="120" height="36" />' +
              '</a>' +
              '<p>' + footer.tagline + '</p>' +
            '</div>' +

            /* Solutions Column */
            '<div class="footer-col">' +
              '<h4>' + footer.solutionsCol + '</h4>' +
              '<a href="' + localizeHref(base + '/solutions/shopify-customer-service.html') + '">' + footer.shopifyService + '</a>' +
              '<a href="' + localizeHref(base + '/solutions/ecommerce-cx-strategy.html') + '">' + footer.cxStrategy + '</a>' +
              '<a href="' + localizeHref(base + '/solutions/wismo-automation.html') + '">' + footer.wismo + '</a>' +
            '</div>' +

            /* Resources Column */
            '<div class="footer-col">' +
              '<h4>' + footer.resourcesCol + '</h4>' +
              '<a href="' + localizeHref(base + '/resources/reduce-support-costs.html') + '">' + footer.reduceCosts + '</a>' +
              '<a href="' + localizeHref(base + '/resources/customer-service-templates.html') + '">' + footer.templates + '</a>' +
              '<a href="' + localizeHref(base + '/resources/cx-metrics-guide.html') + '">' + footer.metrics + '</a>' +
              '<a href="' + localizeHref(base + '/blog/index.html') + '">' + footer.blog + '</a>' +
            '</div>' +

            /* Contact Column */
            '<div class="footer-col footer-col--contact">' +
              '<h4>' + footer.contactCol + '</h4>' +
              '<a href="mailto:karim@agoracrew.com">karim@agoracrew.com</a>' +
              '<a href="tel:+36300841533">+36 30 084 1533</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#contact">' + footer.bookAudit + '</a>' +
            '</div>' +

          '</div>' +

          /* Bottom Bar */
          '<div class="footer-bottom">' +
            '<span>' + footer.copyright + '</span>' +
            '<span class="footer-tax-id">' + footer.taxId + '</span>' +
            '<div class="footer-bottom-links">' +
              '<a href="' + localizeHref(base + '/privacy-policy.html') + '">' + footer.privacy + '</a>' +
              // Mentions légales/CGV are French-only pages (no English
              // counterpart exists), so only render real links — and the
              // extra mentions-légales link at all — on the French tree.
              // English keeps its pre-existing '#' placeholder unchanged.
              (locale === 'fr'
                ? '<a href="' + base + '/fr/mentions-legales.html">' + footer.mentionsLegales + '</a>' +
                  '<a href="' + base + '/fr/cgv.html">' + footer.terms + '</a>'
                : '<a href="#">' + footer.terms + '</a>') +
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
