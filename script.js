/* ============================================
   AGORACREW — Red Sun Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // NAVBAR SCROLL EFFECT
  // ============================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ============================
  // MOBILE MENU
  // ============================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = mobileMenuBtn.querySelectorAll('span');
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

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ============================
  // HERO TAB BAR — Auto-cycling & Click
  // ============================
  const tabs = ['onboarding', 'training', 'quality', 'golive'];
  let currentTabIndex = 0;
  let tabInterval;

  function activateTab(tabName) {
    // Update button states (both desktop & mobile)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Show/hide overlays
    tabs.forEach(t => {
      const overlay = document.getElementById(`overlay-${t}`);
      if (overlay) {
        overlay.style.display = (t === tabName) ? 'flex' : 'none';
      }
    });
  }

  function startTabCycle() {
    tabInterval = setInterval(() => {
      currentTabIndex = (currentTabIndex + 1) % tabs.length;
      activateTab(tabs[currentTabIndex]);
    }, 4000);
  }

  // Initialize tab cycling
  activateTab(tabs[0]);
  startTabCycle();

  // Tab click handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      currentTabIndex = tabs.indexOf(tabName);
      activateTab(tabName);

      // Reset interval on manual click
      clearInterval(tabInterval);
      startTabCycle();
    });
  });

  // ============================
  // SCROLL REVEAL (Intersection Observer)
  // ============================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================
  // CURRENCY TOGGLE (USD / EUR)
  // ============================
  const currencyToggle = document.getElementById('currencyToggle');
  const labelUSD = document.getElementById('labelUSD');
  const labelEUR = document.getElementById('labelEUR');

  if (currencyToggle) {
    // Clicking the labels should also toggle
    labelUSD.addEventListener('click', () => {
      currencyToggle.checked = false;
      currencyToggle.dispatchEvent(new Event('change'));
    });
    labelEUR.addEventListener('click', () => {
      currencyToggle.checked = true;
      currencyToggle.dispatchEvent(new Event('change'));
    });

    currencyToggle.addEventListener('change', () => {
      const isEUR = currencyToggle.checked;
      const key = isEUR ? 'eur' : 'usd';

      // Toggle active label
      labelUSD.classList.toggle('currency-label--active', !isEUR);
      labelEUR.classList.toggle('currency-label--active', isEUR);

      // Swap currency symbols (includes AI plan)
      document.querySelectorAll('.price-currency[data-usd], .ai-price-currency[data-usd]').forEach(el => {
        el.textContent = el.dataset[key];
      });

      // Swap price values (includes AI plan)
      document.querySelectorAll('.price-value[data-usd], .ai-price-value[data-usd]').forEach(el => {
        el.textContent = el.dataset[key];
      });

      // Swap text content (staffing fees, overage, etc.)
      document.querySelectorAll('[data-usd][data-eur]:not(.price-currency):not(.price-value):not(.ai-price-currency):not(.ai-price-value)').forEach(el => {
        el.textContent = el.dataset[key];
      });
    });
  }

  // ============================
  // CONTACT FORM HANDLING
  // ============================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      e.preventDefault();

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('show');
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      });
    });
  }

  // ============================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
