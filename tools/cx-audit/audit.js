// AgoraCrew CX & Conversion Health Audit — frontend glue.
// Backed by the existing Project Rising Lion backend at api.agoracrew.com
// (routes/cxAudit.js, mounted at /api/audit), not a separate service.
const AUDIT_API_BASE = 'https://api.agoracrew.com';

const AUDIT_STRINGS = {
  en: {
    scanning: 'Scanning your store…',
    invalidUrl: 'That doesn’t look like a valid store URL. Try just the domain, e.g. yourstore.myshopify.com.',
    scanFailed: 'Something went wrong running the audit. Please try again in a moment.',
    genericError: 'Couldn’t reach the audit service. Please try again shortly.',
    sending: 'Sending…',
    sent: 'Sent! Check your inbox for the full report.',
    emailFailed: 'The report couldn’t be emailed right now — please try again later.',
    emailInvalid: 'Couldn’t send the report — please double-check your email and try again.',
  },
  fr: {
    scanning: 'Analyse de votre boutique en cours…',
    invalidUrl: 'Cela ne ressemble pas à une URL de boutique valide. Indiquez juste le domaine, par ex. votreboutique.myshopify.com.',
    scanFailed: 'Une erreur s’est produite pendant l’audit. Merci de réessayer dans un instant.',
    genericError: 'Impossible de contacter le service d’audit. Merci de réessayer sous peu.',
    sending: 'Envoi en cours…',
    sent: 'Envoyé ! Consultez votre boîte de réception pour le rapport complet.',
    emailFailed: 'Le rapport n’a pas pu être envoyé pour le moment — merci de réessayer plus tard.',
    emailInvalid: 'Impossible d’envoyer le rapport — merci de vérifier votre adresse e-mail et de réessayer.',
  },
};
const auditLocale = document.documentElement.lang === 'fr' ? 'fr' : 'en';
const t = AUDIT_STRINGS[auditLocale];

const PILLAR_LABELS_BY_LOCALE = {
  en: {
    support: 'Customer Support Responsiveness',
    speed: 'Site Speed',
    trust: 'Trust & Social Proof',
    checkout: 'Checkout Friction',
  },
  fr: {
    support: 'Réactivité du support client',
    speed: 'Vitesse du site',
    trust: 'Confiance et preuve sociale',
    checkout: 'Friction au paiement',
  },
};
const PILLAR_LABELS = PILLAR_LABELS_BY_LOCALE[auditLocale];

const form = document.getElementById('audit-form');
const statusEl = document.getElementById('audit-status');
const resultsEl = document.getElementById('audit-results');
const scoreEl = document.getElementById('score-display');
const pillarsEl = document.getElementById('pillars-display');
const findingsEl = document.getElementById('findings-list');
const reportForm = document.getElementById('report-form');
const reportStatus = document.getElementById('report-status');

let lastScannedUrl = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('store-url').value.trim();
  statusEl.textContent = t.scanning;
  resultsEl.hidden = true;

  try {
    const res = await fetch(`${AUDIT_API_BASE}/api/audit/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.error === 'invalid_url'
        ? t.invalidUrl
        : t.scanFailed;
      return;
    }

    lastScannedUrl = url;
    statusEl.textContent = '';
    scoreEl.textContent = `${data.score} / 100`;

    pillarsEl.innerHTML = '';
    Object.entries(data.pillars || {}).forEach(([key, pillar]) => {
      const card = document.createElement('div');
      card.className = 'info-card';
      const label = PILLAR_LABELS[key] || key;
      card.innerHTML = `<h3>${label}</h3><p>${pillar.score}/100</p>`;
      pillarsEl.appendChild(card);
    });

    findingsEl.innerHTML = '';
    (data.findings || []).forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      findingsEl.appendChild(li);
    });
    resultsEl.hidden = false;
  } catch (err) {
    statusEl.textContent = t.genericError;
  }
});

reportForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('report-email').value.trim();
  reportStatus.textContent = t.sending;

  try {
    const res = await fetch(`${AUDIT_API_BASE}/api/audit/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: lastScannedUrl, email }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      reportStatus.textContent = t.sent;
    } else if (data.error === 'email_unavailable') {
      reportStatus.textContent = t.emailFailed;
    } else {
      reportStatus.textContent = t.emailInvalid;
    }
  } catch {
    reportStatus.textContent = t.genericError;
  }
});
