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

  // ============================
  // ROI CALCULATOR
  // ============================
  const roiVolumeSlider = document.getElementById('roiVolumeSlider');
  const roiVolumeNumber = document.getElementById('roiVolumeNumber');
  const roiCostSlider = document.getElementById('roiCostSlider');
  const roiCostNumber = document.getElementById('roiCostNumber');
  const roiCurrentCost = document.getElementById('roiCurrentCost');
  const roiPlanName = document.getElementById('roiPlanName');
  const roiPlanFee = document.getElementById('roiPlanFee');
  const roiSavingsAmount = document.getElementById('roiSavingsAmount');
  const roiSavingsSubline = document.getElementById('roiSavingsSubline');
  const roiSavingsBlock = document.getElementById('roiSavingsBlock');
  const roiNeutralMessage = document.getElementById('roiNeutralMessage');

  if (roiVolumeSlider) {
    const roiCurrencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    const updateROI = () => {
      let volume = parseInt(roiVolumeNumber.value, 10);
      let cost = parseFloat(roiCostNumber.value);

      if (isNaN(volume) || volume < 100) volume = 100;
      if (volume > 6000) volume = 6000;
      if (isNaN(cost) || cost < 1) cost = 1;
      if (cost > 15) cost = 15;

      roiVolumeSlider.value = volume;
      roiVolumeNumber.value = volume;
      roiCostSlider.value = cost;
      roiCostNumber.value = cost.toFixed(2);

      const result = computeROI(volume, cost);

      roiCurrentCost.textContent = roiCurrencyFormatter.format(result.currentCost);
      roiPlanName.textContent = result.plan;
      roiPlanFee.textContent = roiCurrencyFormatter.format(result.fee);

      if (result.savings > 0) {
        roiSavingsBlock.hidden = false;
        roiNeutralMessage.hidden = true;
        roiSavingsAmount.textContent = roiCurrencyFormatter.format(result.savings) + '/mo';
        roiSavingsSubline.textContent = '(' + result.savingsPercent + '% less · ' + roiCurrencyFormatter.format(result.annualSavings) + '/yr)';
      } else {
        roiSavingsBlock.hidden = true;
        roiNeutralMessage.hidden = false;
      }
    };

    roiVolumeSlider.addEventListener('input', () => {
      roiVolumeNumber.value = roiVolumeSlider.value;
      updateROI();
    });
    roiVolumeNumber.addEventListener('input', updateROI);
    roiCostSlider.addEventListener('input', () => {
      roiCostNumber.value = parseFloat(roiCostSlider.value).toFixed(2);
      updateROI();
    });
    roiCostNumber.addEventListener('input', updateROI);

    updateROI();
  }

  // ============================
  // LANGUAGE BANNER
  // ============================
  // Suggests switching language based on browser locale; never
  // auto-redirects (bad for SEO crawlability and for VPN/expat users).
  // Cookie-remembered dismissal so it doesn't nag on every pageview.
  (function () {
    const COOKIE_NAME = 'agoracrew_lang_pref';
    const currentLocale = document.documentElement.lang === 'fr' ? 'fr' : 'en';

    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
    function setCookie(name, value) {
      document.cookie = name + '=' + value + ';path=/;max-age=' + (60 * 60 * 24 * 365);
    }

    if (getCookie(COOKIE_NAME)) return; // already dismissed or already chose, either language

    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const suggestFrench = currentLocale === 'en' && browserLang.indexOf('fr') === 0;
    const suggestEnglish = currentLocale === 'fr' && browserLang.indexOf('fr') !== 0;
    if (!suggestFrench && !suggestEnglish) return;

    const banner = document.createElement('div');
    banner.className = 'lang-banner';

    const text = document.createElement('span');
    text.textContent = suggestFrench
      ? 'On dirait que vous préférez le français.'
      : 'It looks like you might prefer English.';

    const switchLink = document.createElement('a');
    switchLink.href = suggestFrench
      ? window.location.pathname.replace(/^(\/)?/, '$1fr/')
      : window.location.pathname.replace('/fr/', '/');
    switchLink.textContent = suggestFrench ? 'Voir en français' : 'View in English';
    switchLink.addEventListener('click', () => setCookie(COOKIE_NAME, suggestFrench ? 'fr' : 'en'));

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss');
    dismiss.textContent = '✕';
    dismiss.addEventListener('click', () => {
      setCookie(COOKIE_NAME, currentLocale);
      banner.remove();
    });

    banner.appendChild(text);
    banner.appendChild(switchLink);
    banner.appendChild(dismiss);
    document.body.appendChild(banner);
  })();

});
