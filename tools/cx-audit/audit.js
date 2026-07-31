// AgoraCrew CX & Conversion Health Audit — frontend glue.
// Update AUDIT_API_BASE to the deployed Project FirstClient URL once it's live.
const AUDIT_API_BASE = 'http://localhost:4100';

const PILLAR_LABELS = {
  support: 'Customer Support Responsiveness',
  speed: 'Site Speed',
  trust: 'Trust & Social Proof',
  checkout: 'Checkout Friction',
};

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
  statusEl.textContent = 'Scanning your store…';
  resultsEl.hidden = true;

  try {
    const res = await fetch(`${AUDIT_API_BASE}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.error === 'invalid_url'
        ? 'That doesn’t look like a valid store URL. Try just the domain, e.g. yourstore.myshopify.com.'
        : 'Something went wrong running the audit. Please try again in a moment.';
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
    statusEl.textContent = 'Couldn’t reach the audit service. Please try again shortly.';
  }
});

reportForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('report-email').value.trim();
  reportStatus.textContent = 'Sending…';

  try {
    const res = await fetch(`${AUDIT_API_BASE}/api/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: lastScannedUrl, email }),
    });
    const data = await res.json();
    reportStatus.textContent = res.ok && data.success
      ? 'Sent! Check your inbox for the full report.'
      : 'Couldn’t send the report — please double-check your email and try again.';
  } catch {
    reportStatus.textContent = 'Couldn’t reach the audit service. Please try again shortly.';
  }
});
