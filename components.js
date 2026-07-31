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

  /* ==================== NAVBAR ==================== */
  var navbarRoot = document.getElementById('navbar-root');
  if (navbarRoot) {
    navbarRoot.outerHTML =
      '<nav class="navbar" id="navbar">' +
        '<div class="container">' +
          '<a href="' + base + '/index.html" class="nav-logo">' +
            '<span class="nav-logo-icon" aria-hidden="true"></span>' +
            '<span class="nav-logo-text"><span class="nav-logo-text-agora">Agora</span><span class="nav-logo-text-crew">Crew</span></span>' +
          '</a>' +

          '<div class="nav-center" id="navCenter">' +
            '<a href="' + base + '/index.html#problem">The Math</a>' +
            '<a href="' + base + '/index.html#how-it-works">How It Works</a>' +
            '<a href="' + base + '/index.html#pricing">Pricing</a>' +
            '<div class="nav-dropdown">' +
              '<button class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">' +
                'Learn' +
                '<svg class="nav-dropdown-arrow" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</button>' +
              '<div class="nav-dropdown-menu">' +
                '<div class="nav-dropdown-col">' +
                  '<div class="nav-dropdown-col-title">Solutions</div>' +
                  '<a href="' + base + '/solutions/shopify-customer-service.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">Shopify CX Guide</span><span class="nav-dropdown-link-desc">Manage support on Shopify</span></span>' +
                  '</a>' +
                  '<a href="' + base + '/solutions/ecommerce-cx-strategy.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">CX Strategy</span><span class="nav-dropdown-link-desc">Build a CX playbook</span></span>' +
                  '</a>' +
                  '<a href="' + base + '/solutions/wismo-automation.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">WISMO Automation</span><span class="nav-dropdown-link-desc">Eliminate order tracking tickets</span></span>' +
                  '</a>' +
                '</div>' +
                '<div class="nav-dropdown-col">' +
                  '<div class="nav-dropdown-col-title">Resources</div>' +
                  '<a href="' + base + '/resources/reduce-support-costs.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">Cut Support Costs</span><span class="nav-dropdown-link-desc">7 proven cost-saving tactics</span></span>' +
                  '</a>' +
                  '<a href="' + base + '/resources/customer-service-templates.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">Response Templates</span><span class="nav-dropdown-link-desc">Free copy-paste templates</span></span>' +
                  '</a>' +
                  '<a href="' + base + '/resources/cx-metrics-guide.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">CX Metrics Guide</span><span class="nav-dropdown-link-desc">6 metrics that matter</span></span>' +
                  '</a>' +
                '</div>' +
                '<div class="nav-dropdown-col">' +
                  '<div class="nav-dropdown-col-title">Blog</div>' +
                  '<a href="' + base + '/blog/index.html" class="nav-dropdown-link">' +
                    '<span class="nav-dropdown-link-text"><span class="nav-dropdown-link-title">All Articles</span><span class="nav-dropdown-link-desc">Latest CX insights & guides</span></span>' +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<a href="' + base + '/index.html#contact">Contact</a>' +
          '</div>' +

          '<div class="nav-right">' +
            '<a href="' + base + '/index.html#contact" class="nav-cta-secondary">Book a CX Audit</a>' +
            '<a href="' + base + '/index.html#contact" class="nav-cta">Start Free Trial</a>' +
          '</div>' +

          '<button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +

          '<div class="nav-links" id="navLinks">' +
            '<a href="' + base + '/index.html#problem">The Math</a>' +
            '<a href="' + base + '/index.html#how-it-works">How It Works</a>' +
            '<a href="' + base + '/index.html#pricing">Pricing</a>' +
            '<button class="mobile-dropdown-toggle" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">' +
              'Learn' +
              '<svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<div class="mobile-dropdown-items">' +
              '<a href="' + base + '/solutions/shopify-customer-service.html">Shopify CX Guide</a>' +
              '<a href="' + base + '/solutions/ecommerce-cx-strategy.html">CX Strategy</a>' +
              '<a href="' + base + '/solutions/wismo-automation.html">WISMO Automation</a>' +
              '<a href="' + base + '/resources/reduce-support-costs.html">Cut Support Costs</a>' +
              '<a href="' + base + '/resources/customer-service-templates.html">Response Templates</a>' +
              '<a href="' + base + '/resources/cx-metrics-guide.html">CX Metrics Guide</a>' +
              '<a href="' + base + '/blog/index.html">Blog</a>' +
            '</div>' +
            '<a href="' + base + '/index.html#contact">Contact</a>' +
            '<a href="' + base + '/index.html#contact" class="nav-cta">Start Free Trial</a>' +
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
              '<a href="' + base + '/index.html" class="nav-logo">' +
                '<span class="nav-logo-icon" aria-hidden="true"></span>' +
                '<span class="nav-logo-text"><span class="nav-logo-text-agora">Agora</span><span class="nav-logo-text-crew">Crew</span></span>' +
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
