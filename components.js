/**
 * AgoraCrew — Reusable Component Injector
 * Injects consistent navbar and footer into all inner pages.
 *
 * Usage (from any page one level deep, e.g. /blog/index.html):
 *   <div id="navbar-root"></div>
 *   ...page content...
 *   <div id="footer-root"></div>
 *   <script src="../components.js" data-base=".."></script>
 *
 * English-only since the 2026-09 pivot. The French tree and the
 * Shopify/CX pages it served now live under /archive, so the locale
 * switch, the `data-locale` attribute and the language switcher were
 * removed rather than left pointing at archived URLs. The `data-base`
 * attribute still works exactly as before.
 */

(function () {
  var script = document.currentScript;
  var base = script.getAttribute('data-base') || '..';

  // The two marketplace install links. Absolute, because they leave the site.
  var INSTALL_HUBSPOT = 'https://qbhubspot.agoracrew.com/Setup';
  var INSTALL_MONDAY = 'https://auth.monday.com/oauth2/authorize' +
    '?client_id=3557c97dc1a00d3f575e529907095935&response_type=install';

  var home = base + '/index.html';

  /* ==================== NAVBAR ==================== */
  var navbarRoot = document.getElementById('navbar-root');
  if (navbarRoot) {
    var navItems =
      '<a href="' + home + '#services">What We Automate</a>' +
      '<a href="' + home + '#why">Why Us</a>' +
      '<a href="' + home + '#how-we-work">How It Works</a>' +
      '<a href="' + home + '#apps">QuickBooks Apps</a>' +
      '<a href="' + base + '/blog/index.html">Blog</a>';

    navbarRoot.outerHTML =
      '<nav class="navbar" id="navbar">' +
        '<div class="container">' +
          '<a href="' + home + '" class="nav-logo" aria-label="AgoraCrew">' +
            '<img src="' + base + '/logo-new-orange.png" alt="AgoraCrew" class="nav-logo-img" width="120" height="36" />' +
          '</a>' +

          '<div class="nav-center" id="navCenter">' + navItems + '</div>' +

          '<div class="nav-right">' +
            '<a href="' + home + '#contact" class="btn btn-primary nav-cta">Free Process Audit</a>' +
          '</div>' +

          '<button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +

          '<div class="nav-links" id="navLinks">' + navItems +
            '<a href="' + home + '#contact" class="btn btn-primary nav-cta">Free Process Audit</a>' +
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
              '<a href="' + home + '" class="nav-logo" aria-label="AgoraCrew">' +
                '<img src="' + base + '/logo-new-orange.png" alt="AgoraCrew" class="nav-logo-img" width="120" height="36" />' +
              '</a>' +
              '<p>AI and RPA automation for customer service and finance teams. ' +
                'Built by people with 6+ years running these processes by hand, ' +
                'on the systems you already use.</p>' +
            '</div>' +

            /* Apps Column */
            '<div class="footer-col">' +
              '<h4>What We Automate</h4>' +
              '<a href="' + home + '#services">Ticket triage &amp; logging</a>' +
              '<a href="' + home + '#services">Customer replies &amp; escalations</a>' +
              '<a href="' + home + '#services">Accounts payable</a>' +
              '<a href="' + home + '#services">Cash application &amp; collections</a>' +
              '<a href="' + home + '#services">Reconciliations &amp; close</a>' +
            '</div>' +

            /* Learn Column */
            '<div class="footer-col">' +
              '<h4>Learn &amp; Apps</h4>' +
              '<a href="' + base + '/blog/index.html">Blog</a>' +
              '<a href="' + INSTALL_HUBSPOT + '">QuickBooks → HubSpot app</a>' +
              '<a href="' + INSTALL_MONDAY + '">QuickBooks → monday.com app</a>' +
              '<a href="' + base + '/install">HubSpot setup guide</a>' +
              '<a href="' + base + '/monday-setup">monday setup guide</a>' +
            '</div>' +

            /* Contact Column */
            '<div class="footer-col footer-col--contact">' +
              '<h4>Get In Touch</h4>' +
              '<a href="mailto:support@agoracrew.com">support@agoracrew.com</a>' +
              '<a href="tel:+36300841533">+36 30 084 1533</a>' +
              '<a href="' + home + '#contact">Book a free process audit</a>' +
            '</div>' +

          '</div>' +

          /* Bottom Bar */
          '<div class="footer-bottom">' +
            '<span>© 2026 AgoraCrew. All rights reserved.</span>' +
            '<span class="footer-tax-id">Tax ID (Adószám): HU92198362</span>' +
            '<div class="footer-bottom-links">' +
              '<a href="' + base + '/privacy-policy.html">Privacy Policy</a>' +
              '<a href="' + base + '/terms-of-service.html">Terms of Service</a>' +
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
