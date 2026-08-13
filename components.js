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
      services: 'Services', products: 'Products',
      howWeWork: 'How We Work', contact: 'Contact',
      discussProject: 'Discuss Your Project',
      switcherLabel: 'FR'
    },
    fr: {
      services: 'Services', products: 'Produits',
      howWeWork: 'Notre Processus', contact: 'Contact',
      discussProject: 'Discuter de votre projet',
      switcherLabel: 'EN'
    }
  };
  var nav = NAV_STRINGS[locale];

  var FOOTER_STRINGS = {
    en: {
      tagline: 'Custom software engineering studio specializing in enterprise integrations, e-commerce infrastructure, and AI-powered automation. We ship production-grade systems that scale.',
      servicesCol: 'Services', productsCol: 'Products', contactCol: 'Get In Touch',
      customSoftware: 'Custom Software', integrations: 'Enterprise Integrations',
      ecommerce: 'E-Commerce Infrastructure', aiAutomation: 'AI & Automation',
      productCopilot: 'Order Issue Alerts', productArbridge: 'ARBridge for QuickBooks', productAiAgent: 'AI Support & Growth Agent',
      blog: 'Blog', discussProject: 'Discuss Your Project',
      privacy: 'Privacy Policy', terms: 'Terms of Service',
      copyright: '© 2026 AgoraCrew. All rights reserved.', taxId: 'Tax ID (Adószám): HU92198362'
    },
    fr: {
      tagline: 'Studio d\'ingénierie logicielle sur mesure spécialisé dans les intégrations d\'entreprise, l\'infrastructure e-commerce, et l\'automatisation alimentée par l\'IA. Nous livrons des systèmes de production performants.',
      servicesCol: 'Services', productsCol: 'Produits', contactCol: 'Nous contacter',
      customSoftware: 'Logiciel sur mesure', integrations: 'Intégrations d\'entreprise',
      ecommerce: 'Infrastructure e-commerce', aiAutomation: 'IA & Automatisation',
      productCopilot: 'Order Issue Alerts', productArbridge: 'ARBridge for QuickBooks', productAiAgent: 'Agent IA Support & Croissance',
      blog: 'Blog', discussProject: 'Discuter de votre projet',
      privacy: 'Politique de confidentialité', terms: 'CGV', mentionsLegales: 'Mentions légales',
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
            '<a href="' + localizeHref(base + '/index.html') + '#services">' + nav.services + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#products">' + nav.products + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#how-we-work">' + nav.howWeWork + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact">' + nav.contact + '</a>' +
          '</div>' +

          '<div class="nav-right">' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact" class="btn btn-primary nav-cta">' + nav.discussProject + '</a>' +
            '<a href="' + otherLangUrl() + '" class="nav-lang-switch" aria-label="' + (locale === 'fr' ? 'Switch to English' : 'Passer en français') + '">' + nav.switcherLabel + '</a>' +
          '</div>' +

          '<button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +

          '<div class="nav-links" id="navLinks">' +
            '<a href="' + localizeHref(base + '/index.html') + '#services">' + nav.services + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#products">' + nav.products + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#how-we-work">' + nav.howWeWork + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact">' + nav.contact + '</a>' +
            '<a href="' + localizeHref(base + '/index.html') + '#contact" class="btn btn-primary nav-cta">' + nav.discussProject + '</a>' +
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

            /* Services Column */
            '<div class="footer-col">' +
              '<h4>' + footer.servicesCol + '</h4>' +
              '<a href="' + localizeHref(base + '/index.html') + '#services">' + footer.customSoftware + '</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#services">' + footer.integrations + '</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#services">' + footer.ecommerce + '</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#services">' + footer.aiAutomation + '</a>' +
            '</div>' +

            /* Products Column */
            '<div class="footer-col">' +
              '<h4>' + footer.productsCol + '</h4>' +
              '<a href="' + localizeHref(base + '/index.html') + '#products">' + footer.productCopilot + '</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#products">' + footer.productArbridge + '</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#products">' + footer.productAiAgent + '</a>' +
              '<a href="' + localizeHref(base + '/blog/index.html') + '">' + footer.blog + '</a>' +
            '</div>' +

            /* Contact Column */
            '<div class="footer-col footer-col--contact">' +
              '<h4>' + footer.contactCol + '</h4>' +
              '<a href="mailto:karim@agoracrew.com">karim@agoracrew.com</a>' +
              '<a href="tel:+36300841533">+36 30 084 1533</a>' +
              '<a href="' + localizeHref(base + '/index.html') + '#contact">' + footer.discussProject + '</a>' +
            '</div>' +

          '</div>' +

          /* Bottom Bar */
          '<div class="footer-bottom">' +
            '<span>' + footer.copyright + '</span>' +
            '<span class="footer-tax-id">' + footer.taxId + '</span>' +
            '<div class="footer-bottom-links">' +
              '<a href="' + localizeHref(base + '/privacy-policy.html') + '">' + footer.privacy + '</a>' +
              // Mentions légales is a French-only page (no English
              // counterpart exists), so it only renders on the French tree.
              // Terms of Service now has a real English page
              // (terms-of-service.html, covering ARBridge for QuickBooks
              // and Order Issue Alerts) — the French tree still points at
              // cgv.html, its own general Conditions Générales de Vente.
              (locale === 'fr'
                ? '<a href="' + base + '/fr/mentions-legales.html">' + footer.mentionsLegales + '</a>' +
                  '<a href="' + base + '/fr/cgv.html">' + footer.terms + '</a>'
                : '<a href="' + base + '/terms-of-service.html">' + footer.terms + '</a>') +
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
